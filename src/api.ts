import type { Note } from './types';

// Mock async API for saving/loading notes (bonus feature V).

const MOCK_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiSaveNotes(notes: Note[]): Promise<void> {
  await delay(MOCK_DELAY_MS);
  // In a real app this would POST to a REST endpoint.
  console.log('[Mock API] Save notes', notes.length);
}

export async function apiLoadNotes(): Promise<Note[]> {
  await delay(MOCK_DELAY_MS);
  // In a real app this would GET from a REST endpoint.
  return [];
}
