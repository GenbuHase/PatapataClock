# PatapataClock

京急の駅時計にインスパイアした、スプリットフラップ（パタパタ）表示の Web 時計です。

Solari 式ディスプレイの雰囲気を、CSS 3D フリップアニメーションで再現しています。

## 機能

- **フリップ時計** — 上下2枚のフラップがパタッと切り替わる `HH:MM` 表示
- **京急風テーマ** — ダーク背景・クリーム色フラップ・ヒンジ影
- **PWA 対応** — オフラインでも動作、ホーム画面への追加が可能
- **設定** — 秒表示、12/24時間、テーマ（localStorage に保存）

## 技術スタック

- React 19 + TypeScript
- Vite
- vite-plugin-pwa（Workbox）

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
npm run preview
```

## ライセンス

MIT
