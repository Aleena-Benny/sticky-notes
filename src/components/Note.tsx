import React, { useCallback, useRef, useState } from 'react';
import type { Note as NoteType } from '../types';
import { NOTE_COLORS } from '../types';

type DragMode = 'move' | 'resize' | null;

interface NoteProps {
  note: NoteType;
  isDraggingToTrash: boolean;
  onMove: (id: string, dx: number, dy: number) => void;
  onResize: (id: string, dx: number, dy: number, anchor: 'se') => void;
  onBringToFront: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Pick<NoteType, 'text' | 'color'>>) => void;
  onDragStart: (id: string, mode: 'move' | 'resize') => void;
  onDragEnd: (id: string) => void;
}

export function Note({
  note,
  isDraggingToTrash,
  onMove,
  onResize,
  onBringToFront,
  onUpdate,
  onDragStart,
  onDragEnd,
}: NoteProps) {
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.dataset.resize === 'true') {
        setDragMode('resize');
        initialSize.current = { width: note.width, height: note.height };
        onDragStart(note.id, 'resize');
      } else {
        onBringToFront(note.id);
        setDragMode('move');
        onDragStart(note.id, 'move');
      }
      lastPos.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [note.id, note.width, note.height, onBringToFront, onDragStart]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragMode === null) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      if (dragMode === 'move') {
        onMove(note.id, dx, dy);
      } else {
        onResize(note.id, dx, dy, 'se');
      }
    },
    [dragMode, note.id, onMove, onResize]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      if (dragMode !== null) {
        onDragEnd(note.id);
        setDragMode(null);
      }
    },
    [dragMode, note.id, onDragEnd]
  );

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate(note.id, { text: e.target.value });
    },
    [note.id, onUpdate]
  );

  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleColorSelect = useCallback(
    (color: string) => {
      onUpdate(note.id, { color });
      setShowColorPicker(false);
    },
    [note.id, onUpdate]
  );

  return (
    <div
      className="note"
      data-note-id={note.id}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        backgroundColor: note.color,
        zIndex: note.zIndex,
        opacity: isDraggingToTrash ? 0.5 : 1,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      <div className="note-header">
        <button
          type="button"
          className="note-color-btn"
          style={{ backgroundColor: note.color }}
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker((v) => !v);
          }}
          title="Change color"
          aria-label="Change color"
        />
        {showColorPicker && (
          <div className="note-color-picker" onClick={(e) => e.stopPropagation()}>
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className="note-color-swatch"
                style={{ backgroundColor: c }}
                onClick={() => handleColorSelect(c)}
                title={c}
              />
            ))}
          </div>
        )}
      </div>
      <div className="note-body">
        {isEditing ? (
          <textarea
            className="note-textarea"
            value={note.text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            spellCheck={false}
          />
        ) : (
          <div className="note-text">{note.text || 'Double-click to edit'}</div>
        )}
      </div>
      <div
        className="note-resize-handle"
        data-resize="true"
        title="Drag to resize"
      />
    </div>
  );
}
