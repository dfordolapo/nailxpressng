---
name: "Standardized Next.js Component Generator"
description: "Triggers when instructed to create a new UI component, page, or feature block."
---

# Instructions
When generating a new component for Nailexpress:

1. **Location**: Place all reusable UI components in `src/components/ui/` or `src/components/layout/`.
2. **Client vs Server**: By default, try to keep components as Server Components unless interactivity (hooks like `useState`, `useEffect`) is explicitly required, in which case add `"use client";` at the very top.
3. **Styling**: Always use CSS Modules for component-specific styling (e.g., `ComponentName.module.css`). Do NOT use inline styles unless absolutely necessary for dynamic layout calculations (like physics or scroll coordinates).
4. **Export**: Use `export default function ComponentName() { ... }` syntax.
