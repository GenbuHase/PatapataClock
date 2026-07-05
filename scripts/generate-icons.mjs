import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

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
  const crc = crc32(Buffer.concat([typeBuf, data]))
  crcBuf.writeUInt32BE(crc)
  return Buffer.concat([length, typeBuf, data, crcBuf])
}

function createIcon(size) {
  const width = size
  const height = size
  const raw = Buffer.alloc((width * height * 3) + height)
  let offset = 0

  for (let y = 0; y < height; y++) {
    raw[offset++] = 0
    for (let x = 0; x < width; x++) {
      const margin = Math.floor(size * 0.12)
      const cardW = Math.floor(size * 0.32)
      const cardH = Math.floor(size * 0.62)
      const gap = Math.floor(size * 0.08)
      const cardY = Math.floor(size * 0.19)
      const leftX = margin
      const rightX = margin + cardW + gap
      const hingeY = cardY + Math.floor(cardH / 2)

      const inLeft = x >= leftX && x < leftX + cardW && y >= cardY && y < cardY + cardH
      const inRight = x >= rightX && x < rightX + cardW && y >= cardY && y < cardY + cardH
      const onHinge =
        (inLeft || inRight) && Math.abs(y - hingeY) <= Math.max(1, Math.floor(size * 0.006))

      let r = 0x1a
      let g = 0x1a
      let b = 0x1a

      if (inLeft || inRight) {
        r = 0xf5
        g = 0xf0
        b = 0xe8
      }

      if (onHinge) {
        r = 0x66
        g = 0x66
        b = 0x66
      }

      raw[offset++] = r
      raw[offset++] = g
      raw[offset++] = b
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
  const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])

  return png
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.png', createIcon(192))
writeFileSync('public/icons/icon-512.png', createIcon(512))
console.log('Generated PWA icons')
