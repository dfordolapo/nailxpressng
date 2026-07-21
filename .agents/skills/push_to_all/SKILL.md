---
name: "Push to All GitHub Branches"
description: "Triggers when the user asks to push code, deploy code, or commit changes."
---

# Instructions
When instructed to push code to GitHub:

1. **Format Commits**: Formulate a clean, conventional commit message (e.g., `feat: [description]` or `fix: [description]`).
2. **Build Check**: Consider running `npm run build` or checking for obvious linter errors before pushing to ensure we don't push broken code to the repository.
3. **Dual Push**: Always push the changes to both the `main` and `master` branches so they remain perfectly synced on the remote repository.
   - Example command: `git push origin main && git push origin main:master`
