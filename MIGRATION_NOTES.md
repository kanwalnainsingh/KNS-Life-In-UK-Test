# UI Migration Notes

## Audit summary

- Framework: React 18 with a custom `esbuild` build script
- Entry points:
  - `src/main.jsx`
  - `src/app.jsx`
- Routing model: hash-based tab navigation inside one React app
- Styling model before migration:
  - large inline-style usage in `src/app.jsx`
  - global CSS embedded in `index.html`
  - CSS variable theme based on `data-theme`
- Build/deploy:
  - custom build script at `scripts/build.mjs`
  - GitHub Pages output in `docs/`
- Offline/update path:
  - `service-worker.js`

## High-risk areas to preserve

- Quiz flow and answer-state rendering
- Mock timer, paper balance, and saved progress
- Rapid-fire timers and delayed answer reveal
- Quick Revision saved sessions and ratings
- Story Mode progress
- Hash-based navigation and mobile quick panel
- Theme persistence and release refresh behavior
- Local-storage state keys used by revision modes

## Migration approach

This migration is UI-layer only.

Rules for the migration:

- preserve existing state shape and local-storage keys
- preserve tab ids and hash routes
- preserve question, mock, and rapid-fire logic
- preserve current build and GitHub Pages deployment model
- replace shared styling primitives first
- move repeated layout/styling into reusable components
- keep old styles in place until the Tailwind/shadcn replacement is verified

## Planned steps

1. Add Tailwind CSS to the custom build flow
2. Add a small shadcn-style component layer for:
   - button
   - card
   - badge
   - progress
   - sheet/dialog
   - tabs
3. Switch theme handling to class-based dark mode while preserving persistence
4. Migrate shared UI primitives in `src/app.jsx`
5. Replace the highest-impact layout surfaces:
   - header
   - bottom nav
   - quick panel
   - question cards
   - summary cards
6. Run tests and build after each major step

## Intentional non-goals

- no routing rewrite
- no data-model rewrite
- no feature removal
- no backend or API contract changes
- no redesign from scratch
