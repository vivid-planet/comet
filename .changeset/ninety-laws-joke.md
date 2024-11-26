---
"@comet/admin": minor
---

Add the `StackMainContent` component

This version of `MainContent` only adds content spacing and height when it's the last visible `StackSwitch`.
Using `StackMainContent` instead of `MainContent` prevents unintended or duplicate spacings in cases where multiple `MainContent` components are used inside nested `StackSwitch` components.
