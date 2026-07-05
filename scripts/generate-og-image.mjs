import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const WIDTH = 1200
const HEIGHT = 630

function crc32(data) {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i]
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([length, typeBuf, data, crcBuf])
}

function createPng(width, height, pixels) {
  const raw = Buffer.alloc((width * height * 3) + height)
  let offset = 0

  for (let y = 0; y < height; y++) {
    raw[offset++] = 0
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3
      raw[offset++] = pixels[i]
      raw[offset++] = pixels[i + 1]
      raw[offset++] = pixels[i + 2]
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function createCanvas() {
  const pixels = new Uint8Array(WIDTH * HEIGHT * 3)
  for (let i = 0; i < pixels.length; i += 3) {
    pixels[i] = 0x1a
    pixels[i + 1] = 0x1a
    pixels[i + 2] = 0x1a
  }
  return pixels
}

function setPixel(pixels, x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return
  const i = (y * WIDTH + x) * 3
  pixels[i] = r
  pixels[i + 1] = g
  pixels[i + 2] = b
}

function fillRect(pixels, x, y, w, h, r, g, b) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      setPixel(pixels, px, py, r, g, b)
    }
  }
}

function fillRoundedRect(pixels, x, y, w, h, radius, r, g, b) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      const dx = Math.min(px - x, x + w - 1 - px)
      const dy = Math.min(py - y, y + h - 1 - py)
      if (dx + dy >= radius - 1) {
        setPixel(pixels, px, py, r, g, b)
      }
    }
  }
}

const DIGITS = {
  '0': ['111', '101', '101', '101', '111'],
  '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'],
  '3': ['111', '001', '111', '001', '111'],
  '4': ['101', '101', '111', '001', '001'],
  '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'],
  '7': ['111', '001', '010', '010', '010'],
  '8': ['111', '101', '111', '101', '111'],
  '9': ['111', '101', '111', '001', '111'],
  ':': ['0', '1', '0', '1', '0'],
}

const LETTERS = {
  A: ['010', '101', '111', '101', '101'],
  C: ['011', '100', '100', '100', '011'],
  E: ['111', '100', '110', '100', '111'],
  F: ['111', '100', '110', '100', '100'],
  I: ['111', '010', '010', '010', '111'],
  K: ['101', '101', '110', '101', '101'],
  L: ['100', '100', '100', '100', '111'],
  O: ['010', '101', '101', '101', '010'],
  P: ['110', '101', '110', '100', '100'],
  R: ['110', '101', '110', '101', '101'],
  S: ['011', '100', '010', '001', '110'],
  T: ['111', '010', '010', '010', '010'],
  U: ['101', '101', '101', '101', '111'],
  Y: ['101', '101', '010', '010', '010'],
}

function getGlyph(char) {
  const upper = char.toUpperCase()
  if (DIGITS[upper]) return DIGITS[upper]
  if (LETTERS[upper]) return LETTERS[upper]
  return null
}

function drawDigit(pixels, digit, x, y, scale, color) {
  const pattern = getGlyph(digit)
  if (!pattern) return

  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col] === '1') {
        fillRect(pixels, x + col * scale, y + row * scale, scale, scale, ...color)
      }
    }
  }
}

function drawFlipCard(pixels, x, y, w, h, digit) {
  const cream = [0xf5, 0xf0, 0xe8]
  const dark = [0x11, 0x11, 0x11]
  const hinge = [0x66, 0x66, 0x66]
  const shadow = [0x14, 0x14, 0x14]

  fillRoundedRect(pixels, x, y, w, h, Math.floor(w * 0.08), ...cream)

  const hingeY = y + Math.floor(h / 2)
  fillRect(pixels, x + 2, hingeY, w - 4, 2, ...hinge)

  const topH = Math.floor(h / 2) - 4
  fillRect(pixels, x + 2, y + 2, w - 4, topH, ...shadow)

  const digitScale = Math.floor(w * 0.18)
  const digitW = 3 * digitScale
  const digitH = 5 * digitScale
  const digitX = x + Math.floor((w - digitW) / 2)
  const digitY = y + Math.floor((h - digitH) / 2) - Math.floor(h * 0.04)
  drawDigit(pixels, digit, digitX, digitY, digitScale, cream)
}

function drawText(pixels, text, x, y, scale, color) {
  let cursor = x
  for (const char of text) {
    if (char === ' ') {
      cursor += scale * 2
      continue
    }
    const pattern = getGlyph(char)
    if (!pattern) continue
    drawDigit(pixels, char, cursor, y, scale, color)
    cursor += pattern[0].length * scale + scale
  }
}

function measureText(text, scale) {
  let width = 0
  for (const char of text) {
    if (char === ' ') {
      width += scale * 2
      continue
    }
    const pattern = getGlyph(char)
    if (!pattern) continue
    width += pattern[0].length * scale + scale
  }
  return Math.max(0, width - scale)
}

function createOgImage() {
  const pixels = createCanvas()

  const cardW = 110
  const cardH = 160
  const gap = 18
  const colonW = 24
  const sequence = ['1', '2', ':', '3', '4']
  const totalW =
    cardW * 4 + gap * 3 + colonW
  let cursorX = Math.floor((WIDTH - totalW) / 2)
  const cursorY = Math.floor(HEIGHT * 0.28)

  for (const item of sequence) {
    if (item === ':') {
      const colonScale = 12
      const colonX = cursorX + Math.floor((colonW - 3 * colonScale) / 2)
      const colonY = cursorY + Math.floor((cardH - 5 * colonScale) / 2)
      drawDigit(pixels, ':', colonX, colonY, colonScale, [0xf5, 0xf0, 0xe8])
      cursorX += colonW
    } else {
      drawFlipCard(pixels, cursorX, cursorY, cardW, cardH, item)
      cursorX += cardW + gap
    }
  }

  const titleScale = 14
  const title = 'PATAPATACLOCK'
  drawText(
    pixels,
    title,
    Math.floor((WIDTH - measureText(title, titleScale)) / 2),
    Math.floor(HEIGHT * 0.68),
    titleScale,
    [0xf5, 0xf0, 0xe8],
  )

  return createPng(WIDTH, HEIGHT, pixels)
}

writeFileSync('public/og-image.png', createOgImage())
console.log('Generated public/og-image.png')
