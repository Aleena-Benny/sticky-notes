import { useCallback, useEffect, useState } from 'react';
import type { Note } from './types';
import { NOTE_COLORS, DEFAULT_NOTE_SIZE } from './types';
import { Board } from './components/Board';
import { loadNotesFromStorage, saveNotesToStorage } from './storage';
import { apiSaveNotes } from './api';
import './App.css';

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nextZ(notes: Note[]): number {
  if (notes.length === 0) return 1;
  return Math.max(...notes.map((n) => n.zIndex), 0) + 1;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotesFromStorage());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  const addNote = useCallback((x: number, y: number) => {
    setNotes((prev) => {
      const newNote: Note = {
        id: generateId(),
        x,
        y,
        width: DEFAULT_NOTE_SIZE.width,
        height: DEFAULT_NOTE_SIZE.height,
        text: '',
        color: NOTE_COLORS[0],
        zIndex: nextZ(prev),
      };
      return [...prev, newNote];
    });
  }, []);

  const moveNote = useCallback((id: string, dx: number, dy: number) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, x: n.x + dx, y: n.y + dy } : n
      )
    );
  }, []);

  const resizeNote = useCallback(
    (id: string, dx: number, dy: number, _anchor: 'se') => {
      const MIN_W = 120;
      const MIN_H = 80;
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id !== id) return n;
          const width = Math.max(MIN_W, n.width + dx);
          const height = Math.max(MIN_H, n.height + dy);
          return { ...n, width, height };
        })
      );
    },
    []
  );

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setNotes((prev) => {
      const maxZ = Math.max(...prev.map((n) => n.zIndex), 0);
      const current = prev.find((n) => n.id === id);
      if (!current || current.zIndex === maxZ) return prev;
      return prev.map((n) =>
        n.id === id ? { ...n, zIndex: maxZ + 1 } : n
      );
    });
  }, []);

  const updateNote = useCallback(
    (id: string, patch: Partial<Pick<Note, 'text' | 'color'>>) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...patch } : n))
      );
    },
    []
  );

  const handleSaveToCloud = useCallback(async () => {
    setSaveStatus('saving');
    await apiSaveNotes(notes);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [notes]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Sticky Notes</h1>
        <p className="app-hint">
          Click on the board to add a note. Drag to move, drag the corner to
          resize. Drag to the trash to delete. Double-click to edit text.
        </p>
        <div className="app-actions">
          <button
            type="button"
            className="app-btn app-btn--primary"
            onClick={() => addNote(80, 80)}
          >
            + Add note
          </button>
          <button
            type="button"
            className="app-btn app-btn--secondary"
            onClick={handleSaveToCloud}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving'
              ? 'Saving…'
              : saveStatus === 'saved'
                ? 'Saved!'
                : 'Save to cloud (mock)'}
          </button>
        </div>
      </header>
      <main className="app-main">
        <Board
          notes={notes}
          onAddNote={addNote}
          onMoveNote={moveNote}
          onResizeNote={resizeNote}
          onRemoveNote={removeNote}
          onBringToFront={bringToFront}
          onUpdateNote={updateNote}
        />
      </main>
    </div>
  );
}
