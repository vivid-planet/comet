---
"@comet/cms-admin": patch
---

Prevent broken editing caret in `createTipTapRichTextBlock` with `textBlockStyles`

`@tiptap/react@3.28.0` defers node view portal rendering to a microtask. After pressing Enter, the new paragraph's `contentDOM` doesn't exist yet when ProseMirror restores the selection, so the caret stays in the previous paragraph and further typing lands there. This makes the editor unusable for multi-paragraph entry when `textBlockStyles` are configured (which replaces the native paragraph/heading with React node views).

Restrict the `@tiptap/*` dependencies to `>=3.22.3 <3.28.0` until the upstream regression is fixed.

**Note**: When updating, make sure your lockfile doesn't contain multiple ProseMirror versions (this causes `RangeError: Can not convert <> to a Fragment (looks like multiple versions of prosemirror-model were loaded)` when pressing Enter). Run `pnpm dedupe "prosemirror-*"` or the equivalent for your package manager if necessary.
