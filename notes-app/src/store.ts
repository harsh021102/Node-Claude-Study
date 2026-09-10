import type { Note } from "./types.js";
const notes = new Map<string, Note>();

export function findAll() {
  return [...notes.values()];
}

export function findById(id: string) {
  return notes.get(id);
}

export function save(note: Note) {
  notes.set(note.id, note);
}
export function remove(id: string) {
  return notes.delete(id);
}
