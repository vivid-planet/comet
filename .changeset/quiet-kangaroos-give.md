---
"@comet/admin": minor
---

Add possibility for uncontrolled (promise-based) behavior to `FeedbackButton`

Previously the `FeedbackButton` was controlled by the props `loading` and `hasErrors`. To enable more use cases and easier usage, a promise-based way was added. If neither of the mentioned props are passed, the component uses the promise returned by `onClick` to evaluate the idle, loading and error state.
