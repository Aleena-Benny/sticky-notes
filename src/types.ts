export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  zIndex: number;
}

export const NOTE_COLORS = [
  '#fff9c4', // yellow
  '#c8e6c9', // green
  '#bbdefb', // blue
  '#e1bee7', // purple
  '#ffccbc', // orange
] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];

export const DEFAULT_NOTE_SIZE = { width: 200, height: 180 };
