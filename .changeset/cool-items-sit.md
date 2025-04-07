---
"@comet/admin": major
---

Update props and usage of `FeedbackButton` to be consistent with the new Comet `Button`

- The `variant` prop now replaces its old values and the now removed `color` prop.
- The `responsive` prop is now supported to move the button's text to a tooltip on smaller devices.
- The previous values of `slotProps` have been removed, they can now be set through the `slotProps` of the `root` slot.

```diff
- <FeedbackButton variant="contained" color="primary">
+ <FeedbackButton>
      Okay
  </FeedbackButton>
- <FeedbackButton variant="contained" color="error">
+ <FeedbackButton variant="destructive">
      Delete
  </FeedbackButton>
```
