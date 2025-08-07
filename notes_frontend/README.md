# Note Keeper – Astro App

Minimal, responsive web-based notes application for creating, viewing, editing, and deleting notes.

## Features

- Minimal design, light theme (Primary: #007BFF, Secondary: #6C757D, Accent: #FFC107)
- Responsive UI: header, sidebar notes list, main note editor area
- Add, select, create, edit, delete notes
- Stubs for backend REST API integration (currently uses localStorage; replace in `src/utils/notesService.ts`)
- Easy to extend and test

## Structure

```
src/
├── components/
│   ├── Header.astro        # App header
│   ├── Sidebar.astro       # Notes list and add button
│   ├── NoteEditor.astro    # Main note view/editor
│   └── ThemeToggle.astro   # Optional theme switch
├── layouts/
│   └── Layout.astro        # Base layout
├── utils/
│   └── notesService.ts     # Note CRUD logic (swap for REST API client)
└── pages/
    └── index.astro         # Main notes app UI
```

## Develop

```sh
npm install
npm run dev
```

## REST API Preparation

- Note CRUD is stubbed via localStorage in `src/utils/notesService.ts`.
- To integrate with backend:
  - Replace functions in that service with REST API calls (see exported signatures).
  - Use environment variables from `.env` for configuring API endpoints if needed.

## UI

- Header: App title, always visible
- Sidebar: List notes, add note button
- Main area: Shows and edits selected note
- Mobile-friendly (sidebar collapses stacked on mobile)

## Extending/Testing

- Logic is isolated in `notesService.ts`.
- Components are stateless, all state/actions handled via parent/main script.
- Easily adapted for automated tests via JS injection or component libraries.

