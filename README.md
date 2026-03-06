# Sticky Notes

A single-page web application for sticky notes. Built with React and TypeScript (no stock UI components).

## Features

- **Create a note**: Click on the board or use “Add note” to create a note at a default or chosen position.
- **Move a note**: Drag a note by its body to move it.
- **Resize a note**: Drag the bottom-right corner handle to resize.
- **Remove a note**: Drag a note over the trash zone (bottom-right) and release to delete.
- **Edit text**: Double-click a note to edit its text.
- **Bring to front**: Click a note to bring it above overlapping notes.
- **Colors**: Use the small color button in the note header to change note color.
- **Local storage**: Notes are saved automatically and restored on load.
- **Save to cloud (mock)**: “Save to cloud (mock)” triggers an async mock API call.

## Build and run

Requirements: Node.js 18+ and npm.

```bash
# Install dependencies
npm install

# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

After `npm run dev`, open the URL shown in the terminal (e.g. `http://localhost:5173`). For production, run `npm run build` then `npm run preview` to serve the built files.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a short description of the application architecture and design choices.
