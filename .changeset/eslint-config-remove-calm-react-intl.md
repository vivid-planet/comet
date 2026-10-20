---
"@dextinity/eslint-config": major
---

Remove the deprecated `@calm/eslint-plugin-react-intl` from the React config

Text in JSX is still reported by `react/jsx-no-literals`. Literal `label` and `aria-label` props are now reported by `no-restricted-syntax`.

**Migration**

Replace `@calm/react-intl/missing-formatted-message` in ESLint configs with `no-restricted-syntax`, and remove it from `eslint-disable` comments. ESLint stops with an error while a config or comment still names it.

```diff
- "@calm/react-intl/missing-formatted-message": "off",
+ "no-restricted-syntax": "off",
```

If your ESLint config sets `no-restricted-syntax` itself, its options replace the ones from `@dextinity/eslint-config`. Copy the `label` selector from `@dextinity/eslint-config/react.js` into your list to keep the check.
