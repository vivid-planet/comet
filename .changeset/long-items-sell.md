---
"@comet/cms-admin": minor
---

Remove "Re-login"-button from `CurrentUserProvider`

The button is already implemented in `createErrorDialogApolloLink()`. The correct arrangement of
the components in `App.tsx` (see migration guide) makes the double implementation needless.
