# Architecture

The application is a single-page React app written in TypeScript. State lives at the top level in `App`: a single array of notes, each with id, position (x, y), size (width, height), text, color, and zIndex. All mutations (add, move, resize, remove, update text/color, bring to front) are implemented as updates to this array; there is no separate store or context. Callbacks are passed down to `Board` and then to each `Note`, so the data flow is strictly one-way and easy to follow.

The **Board** component is responsible for the canvas and for drag-to-trash behaviour. When a note reports drag start, the Board subscribes to document-level pointer move and pointer up. On each move it checks whether the pointer is over the trash zone (using a ref and `elementFromPoint`); that state is passed back to the active note so it can show a “about to delete” style. On pointer up, if the pointer is over the trash, the Board calls the remove callback and then clears drag state. This keeps trash logic in one place and avoids the note needing to know about the trash DOM.

**Note** handles its own move and resize with pointer capture: on pointer down it decides between move (default) and resize (when the event target is the resize handle). It then applies deltas on pointer move and notifies the parent. Move and resize are thus implemented without any drag-and-drop library. Text editing is inline (double-click toggles a textarea); color is changed via a small header button that opens a palette. Clicking a note brings it to front by updating its zIndex in the parent state.

**Persistence**: Notes are written to `localStorage` on every state change (in a `useEffect` in `App`) and loaded once on initial mount. A mock async API is provided for the “save to cloud” bonus; the UI calls it on button click and shows a brief status.

**Build**: Vite is used for dev and production builds. No UI component library is used; all components and styles are custom.
