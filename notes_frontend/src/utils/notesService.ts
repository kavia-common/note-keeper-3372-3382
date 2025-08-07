//
// PUBLIC_INTERFACE
/**
 * NotesService: In-memory & localStorage-based CRUD for notes.
 * Replace fetchXYZ calls with real REST API for integration.
 */
type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};
const STORAGE_KEY = 'astro-notesapp-v1';

function getFakeNotes(): Note[] {
  // Sample data if no notes
  return [{
    id: 'sample-note-1',
    title: 'Welcome to Notes!',
    content: '✨ Start writing your notes here!',
    updatedAt: new Date().toISOString(),
  }];
}
function loadNotes(): Note[] {
  let notes: Note[] = [];
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    try {
      notes = stored ? JSON.parse(stored) : [];
    } catch { notes = []; }
    if (!Array.isArray(notes)) notes = [];
    if (notes.length === 0) notes = getFakeNotes();
  }
  return notes;
}

function saveNotes(notes: Note[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }
}

/** Fetch all notes. (stub: local) */
// PUBLIC_INTERFACE
export function fetchAllNotes(): Promise<Note[]> {
  return new Promise(res => {
    setTimeout(() => res(loadNotes()), 90);
  });
}

/** Fetch note by id. */
// PUBLIC_INTERFACE
export function fetchNote(id: string): Promise<Note|null> {
  const notes = loadNotes();
  const found = notes.find(n => n.id === id) || null;
  return Promise.resolve(found);
}

/** Create new note. */
// PUBLIC_INTERFACE
export function createNote(note: Omit<Note, 'id'|'updatedAt'>): Promise<Note> {
  const notes = loadNotes();
  const newNote: Note = {
    ...note,
    id: 'note-' + Math.random().toString(36).slice(2,10),
    updatedAt: new Date().toISOString()
  };
  notes.unshift(newNote);
  saveNotes(notes);
  return Promise.resolve(newNote);
}

/** Update existing note. */
// PUBLIC_INTERFACE
export function updateNote(note: Note): Promise<Note> {
  const notes = loadNotes();
  const i = notes.findIndex(n => n.id === note.id);
  if (i >= 0) {
    notes[i] = { ...note, updatedAt: new Date().toISOString() };
    saveNotes(notes);
    return Promise.resolve(notes[i]);
  }
  return Promise.reject(new Error("Note not found"));
}

/** Delete note. */
// PUBLIC_INTERFACE
export function deleteNote(id: string): Promise<boolean> {
  const notes = loadNotes();
  const prevLen = notes.length;
  const updatedNotes = notes.filter(n => n.id !== id);
  saveNotes(updatedNotes);
  return Promise.resolve(updatedNotes.length < prevLen);
}
