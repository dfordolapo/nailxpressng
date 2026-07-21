---
name: "Strict Design System Compliance"
description: "Triggers when adding new UI elements, styling components, or making design choices."
---

# Instructions
When building or modifying UI components for this project, you must adhere strictly to the established design system:

1. **No Hardcoded Values**: NEVER use hardcoded hex colors, px-based font sizes, or random margins/padding.
2. **Use CSS Variables**:
   - Colors: Always use `var(--color-primary)`, `var(--color-text)`, `var(--color-background)`, etc.
   - Spacing: Always use layout variables like `var(--space-2)`, `var(--space-4)`, `var(--radius-md)`.
3. **Icons**: Use only `lucide-react` for icons. Do not import random SVGs unless specifically requested. Ensure icons have `strokeWidth={1.25}` for consistency.
4. **Aesthetics**: Prioritize the premium brand aesthetic—soft shadows, rounded corners (`var(--radius-lg)`), and clean, minimalist layouts.
