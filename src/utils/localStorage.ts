import { Note } from "@/types/note";

const NOTES_KEY = "notes-app-data";

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Failed to save notes:", error);
  }
};

export const loadNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(NOTES_KEY);
    if (!stored) return [];
    
    const notes = JSON.parse(stored);
    return notes.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  } catch (error) {
    console.error("Failed to load notes:", error);
    return [];
  }
};

export const generateNoteId = (): string => {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};