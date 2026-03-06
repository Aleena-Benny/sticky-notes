import React, { useCallback, useRef, useState, useEffect } from 'react';
import type { Note } from '../types';
import { Note as NoteComponent } from './Note';
import { TrashZone } from './TrashZone';
import './Board.css';
import './Note.css';
import './TrashZone.css';

interface BoardProps {
  notes: Note[];
  onAddNote: (x: number, y: number) => void;
  onMoveNote: (id: string, dx: number, dy: number) => void;
  onResizeNote: (id: string, dx: number, dy: number, anchor: 'se') => void;
  onRemoveNote: (id: string) => void;
  onBringToFront: (id: string) => void;
  onUpdateNote: (
    id: string,
    patch: Partial<Pick<Note, 'text' | 'color'>>
  ) => void;
}

export function Board({
  notes,
  onAddNote,
  onMoveNote,
  onResizeNote,
  onRemoveNote,
  onBringToFront,
  onUpdateNote,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pointerInTrash, setPointerInTrash] = useState(false);

  const checkPointerInTrash = useCallback((clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY);
    return trashRef.current?.contains(el) ?? false;
  }, []);

  useEffect(() => {
    if (draggingId === null) return;

    const handleMove = (e: PointerEvent) => {
      setPointerInTrash(checkPointerInTrash(e.clientX, e.clientY));
    };

    const handleUp = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const inTrash = checkPointerInTrash(e.clientX, e.clientY);
      if (inTrash && draggingId) {
        onRemoveNote(draggingId);
      }
      setDraggingId(null);
      setPointerInTrash(false);
      document.body.classList.remove('user-select-none');
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointercancel', handleUp);
    };

    document.body.classList.add('user-select-none');
    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    document.addEventListener('pointercancel', handleUp);

    return () => {
      document.body.classList.remove('user-select-none');
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointercancel', handleUp);
    };
  }, [draggingId, checkPointerInTrash, onRemoveNote]);

  const handleBoardClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      onAddNote(e.clientX - rect.left, e.clientY - rect.top);
    },
    [onAddNote]
  );

  const handleDragStart = useCallback((id: string, _mode: 'move' | 'resize') => {
    setDraggingId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setPointerInTrash(false);
  }, []);

  return (
    <div className="board" ref={boardRef} onClick={handleBoardClick}>
      {notes.map((note) => (
        <NoteComponent
          key={note.id}
          note={note}
          isDraggingToTrash={draggingId === note.id && pointerInTrash}
          onMove={onMoveNote}
          onResize={onResizeNote}
          onBringToFront={onBringToFront}
          onUpdate={onUpdateNote}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
      <TrashZone
        ref={trashRef}
        isActive={draggingId !== null}
        isPointerInside={pointerInTrash}
      />
    </div>
  );
}
