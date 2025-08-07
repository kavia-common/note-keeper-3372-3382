import React, { useEffect, useState } from "react";
import { fetchAllNotes, createNote, updateNote, deleteNote } from "../utils/notesService.ts";

// Inline all styling (copied from Astro CSS for parity)
const styles = {
  appShell: {
    minHeight: "100vh",
    background: "#fff",
    width: "100vw",
    height: "min(100vh, 100dvh)",
  },
  mainUi: {
    display: "flex",
    flexDirection: "row",
    minHeight: "92vh",
    width: "100vw",
    background: "#fff",
    margin: 0,
    padding: 0,
  },
  sidebar: {
    flex: "0 0 270px",
    minWidth: 130,
    maxWidth: 270,
    height: "auto",
    background: "#f8f9fa",
    borderRight: "1px solid #f3f3f3",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  editorSection: {
    flex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    minWidth: 0,
    minHeight: 0,
    padding: 0,
  },
};

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line
  }, []);

  async function loadNotes(selectId = null) {
    const all = await fetchAllNotes();
    setNotes(all);
    if (all.length === 0) {
      setSelectedNoteId(null);
      setSelectedNote(null);
    } else {
      const id = selectId || selectedNoteId || all[0].id;
      setSelectedNoteId(id);
      setSelectedNote(all.find((n) => n.id === id) || all[0]);
    }
    setIsEditing(false);
  }

  function selectNote(id) {
    setSelectedNoteId(id);
    setSelectedNote(notes.find((n) => n.id === id) || null);
    setIsEditing(false);
  }

  async function addNote() {
    const blank = { title: "", content: "" };
    const res = await createNote(blank);
    await loadNotes(res.id);
    setIsEditing(true);
  }

  function handleEditMode(note) {
    setSelectedNote({ ...note });
    setIsEditing(true);
  }

  async function handleSave(note) {
    if (note.id) await updateNote(note);
    await loadNotes(note.id);
  }

  async function handleDelete(id) {
    if (!id) return;
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    await deleteNote(id);
    await loadNotes();
  }

  // Render
  return (
    <div style={styles.appShell}>
      <header className="header">
        <h1>Note Keeper</h1>
      </header>
      <main id="main-ui" style={styles.mainUi}>
        <aside className="sidebar" style={styles.sidebar}>
          <div className="sidebar-header">
            <span className="list-title">Notes</span>
            <button className="add-btn" title="New note" type="button" onClick={addNote}>
              +
            </button>
          </div>
          <ul className="note-list">
            {notes.length === 0 ? (
              <li className="note-empty">No notes yet</li>
            ) : (
              notes.map((note) => (
                <li
                  className={`note-item${selectedNoteId === note.id ? " selected" : ""}`}
                  key={note.id}
                  onClick={() => selectNote(note.id)}
                  tabIndex={0}
                  aria-selected={selectedNoteId === note.id}
                >
                  <span className="note-title">{note.title || "Untitled"}</span>
                  <span className="note-date">
                    {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : ""}
                  </span>
                </li>
              ))
            )}
          </ul>
        </aside>
        <section className="editor-section" style={styles.editorSection}>
          {!selectedNote ? (
            <div className="editor-empty">
              <span>No note selected</span>
            </div>
          ) : (
            <form
              className="editor-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(selectedNote);
              }}
              style={{ flex: 1 }}
            >
              <input
                type="text"
                name="title"
                className="editor-title"
                placeholder="Title"
                value={isEditing ? selectedNote.title : selectedNote.title}
                onChange={
                  isEditing
                    ? (e) =>
                        setSelectedNote((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                    : undefined
                }
                readOnly={!isEditing}
                autoFocus={isEditing}
                maxLength={120}
                required
              />
              <textarea
                name="content"
                className="editor-content"
                placeholder="Type your note here..."
                rows={14}
                value={isEditing ? selectedNote.content : selectedNote.content}
                onChange={
                  isEditing
                    ? (e) =>
                        setSelectedNote((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                    : undefined
                }
                readOnly={!isEditing}
                required
              />
              <div className="editor-actions">
                {isEditing ? (
                  <button className="btn save-btn" type="submit" title="Save">
                    💾 Save
                  </button>
                ) : (
                  <button
                    className="btn edit-btn"
                    type="button"
                    title="Edit"
                    onClick={() => handleEditMode(selectedNote)}
                  >
                    ✏️ Edit
                  </button>
                )}
                <button
                  className="btn delete-btn"
                  type="button"
                  title="Delete"
                  onClick={() => handleDelete(selectedNote.id)}
                  style={{ marginLeft: "auto" }}
                >
                  🗑️ Delete
                </button>
              </div>
              <span className="editor-updated">
                Last updated:{" "}
                {selectedNote.updatedAt
                  ? new Date(selectedNote.updatedAt).toLocaleString()
                  : "never"}
              </span>
            </form>
          )}
        </section>
      </main>
      <style>{`
      /* ... Use previous CSS from Sidebar.astro and NoteEditor.astro ... */
      .header {
        width: 100%;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
        padding: 1rem 2rem;
        color: #007BFF;
        font-weight: 700;
        font-size: 1.6rem;
        letter-spacing: 0.04em;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.03);
        display: flex;
        align-items: center;
      }
      .header h1 {
        font-size: 1.6rem;
        color: #007BFF;
        margin: 0;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.2;
      }
      @media (max-width: 600px) {
        .header {
          padding: 0.75rem 1rem;
        }
        .header h1 {
          font-size: 1.15rem;
        }
      }
      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.1rem 1rem 0.5rem 1rem;
        font-size: 1.08rem;
        font-weight: 600;
        color: #6C757D;
        border-bottom: 1px solid #efefef;
      }
      .list-title {
        text-transform: uppercase;
        letter-spacing: 0.07em;
        font-size: 1.01rem;
      }
      .add-btn {
        border: none;
        background: #007BFF;
        color: #fff;
        width: 30px; height: 30px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.55rem;
        cursor: pointer;
        transition: background-color .18s;
        display: flex; align-items: center; justify-content: center;
      }
      .add-btn:hover,.add-btn:focus {
        background: #0056b3;
      }
      .note-list {
        margin: 0; padding: 0.8rem 0;
        flex: 1 1 0; min-height: 0; overflow-y: auto;
        list-style: none;
        scrollbar-color: #007BFF #ededed;
      }
      .note-item {
        cursor: pointer;
        padding: 0.7rem 1.2rem;
        outline: none;
        font-size: 1.01rem;
        color: #444;
        border-left: 3px solid transparent;
        display: flex; flex-direction: column;
        background: transparent;
        border-radius: 5px;
        transition: all .13s;
      }
      .note-item.selected {
        background: #E9F3FF;
        color: #007BFF;
        border-left: 3px solid #007BFF;
      }
      .note-item:hover:not(.selected),
      .note-item:focus-visible:not(.selected) {
        background: #f1f5fa;
        color: #0056b3;
      }
      .note-title {
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 95%;
      }
      .note-date {
        color: #aaa; font-size: 0.85rem; margin-top: 2px;
      }
      .note-empty {
        padding: 1.5rem 1.2rem;
        text-align: center; color: #bdbdbd;
        font-style: italic; font-size: 1.05rem;
      }
      .editor-empty {
        width: 100%; margin: auto; color: #aaa;
        text-align: center; padding: 2.2rem 0;
        font-size: 1.14rem;
      }
      .editor-form {
        display: flex; flex-direction: column; min-height: 0; width: 100%;
        gap: 0.8rem; padding: 2.3rem 2.4rem 2rem 2.4rem;
        background: #FFF;
        border-radius: 10px;
        margin: auto;
        box-shadow: 0 0 0 0 rgba(0,0,0,0);
        max-width: 680px;
      }
      .editor-title {
        font-size: 1.3rem; padding: 0.7rem; font-weight: 600;
        border: 1px solid #CED4DA; border-radius: 7px;
        color: #007BFF; background: #f8f9fa;
        margin-bottom: 0.6rem;
        outline: none; transition: border-color 0.2s;
      }
      .editor-title:focus, .editor-title:active {
        border-color: #007BFF; background: #E9F3FF;
      }
      .editor-content {
        font-size: 1.09rem;
        padding: 0.75rem 0.8rem;
        border: 1px solid #ddd; border-radius: 6px;
        color: #232323; background: #fcfcfc;
        min-height: 220px; resize: vertical; line-height: 1.5;
        outline: none; transition: border-color 0.17s;
      }
      .editor-content:focus {
        border-color: #007BFF;
        background: #EFEFFF;
      }
      .editor-actions {
        display: flex; align-items: center; gap:1rem;
        margin-top: 0.5rem;
      }
      .btn {
        border: none; padding: 0.54rem 1.1rem; font-size:1.06rem;
        border-radius: 7px; font-weight: 600;
        cursor: pointer; transition: background 0.1s,color 0.1s;
      }
      .save-btn {
        background: #007BFF; color: #fff;
      }
      .edit-btn {
        background: #6C757D; color: #fff;
      }
      .delete-btn {
        background: #FFC107; color: #432700;
      }
      .save-btn:hover, .edit-btn:hover { filter: brightness(1.04); }
      .delete-btn:hover { background: #ff5e19; color: #fff; }
      .editor-updated {
        align-self: flex-end;
        font-size: 0.93rem;
        color: #7c7c7c;
        margin-top: 0.7rem;
      }
      @media (max-width: 900px) {
        #main-ui { flex-direction: column;}
        aside.sidebar { width: 100vw; max-width: none; border-right: none; border-bottom: 1px solid #e3e3e3; min-height: 0; height: auto;}
        .editor-form { padding: 1.2rem 1rem 1.4rem 1rem; }
      }
      @media (max-width: 600px) {
        #main-ui { flex-direction: column; min-height: unset;}
        aside.sidebar { min-width: 0; max-width: none; width: 100vw; border-bottom: 1px solid #ededed;}
        .editor-form, .editor-section { border-radius: 0;}
        .editor-form { padding: 0.7rem 0.25rem 0.9rem 0.25rem; min-width: 0;}
      }
      `}
      </style>
    </div>
  );
}
