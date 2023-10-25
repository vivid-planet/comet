---
"@comet/admin-icons": minor
---

Change how `maxVisible` in `FeaturesButtonGroup` works:

- If maxVisible = 4 and there are four features -> all four features (and no dropdown) are shown
- If maxVisible = 4 and there are five features -> three features and the dropdown (containing two features) are shown
