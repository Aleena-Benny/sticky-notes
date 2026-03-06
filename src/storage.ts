import type { Note } from './types';

const STORAGE_KEY = 'sticky-notes-data';

export function loadNotesFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidNote);
  } catch {
    return [];
  }
}

function isValidNote(item: unknown): item is Note {
  if (!item || typeof item !== 'object') return false;
  const n = item as Record<string, unknown>;
  return (
    typeof n.id === 'string' &&
    typeof n.x === 'number' &&
    typeof n.y === 'number' &&
    typeof n.width === 'number' &&
    typeof n.height === 'number' &&
    typeof n.text === 'string' &&
    typeof n.color === 'string' &&
    typeof n.zIndex === 'number'
  );
}

export function saveNotesToStorage(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore quota or other errors
  }
}
