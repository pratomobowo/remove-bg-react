# Image Background Remover

Aplikasi modern untuk menghapus background gambar dengan opsi untuk mengganti background dengan warna solid menggunakan AI.

## Fitur

- 🖼️ **Drag & Drop Upload** - Interface intuitif untuk upload gambar
- ✂️ **AI Background Removal** - Processing dilakukan di server menggunakan AI model
- 🎨 **Background Color Options**:
  - Transparent (tanpa background)
  - Merah resmi dokumen foto (#DB1514)
  - Biru resmi dokumen foto (#0000FF)
  - Custom color picker untuk warna lainnya
- 💾 **Export PNG** - Download dengan transparent atau background berwarna
- 📊 **Loading Screen** - Progress indicator yang informatif
- 🎯 **UI Modern** - Design clean, simple, dan estetik dengan Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Background Removal**: @imgly/background-removal-node (Server-side)
- **Backend**: Node.js + Express + TypeScript
- **Image Processing**: Sharp
- **Monorepo**: npm workspaces

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
# Run both client and server
npm run dev

# Run client only
npm run dev:client

# Run server only
npm run dev:server
```

### Build

```bash
npm run build
```

## Project Structure

```
remove-bg/
├── client/          # React frontend
├── server/          # Node.js backend
└── package.json     # Root package.json
```
