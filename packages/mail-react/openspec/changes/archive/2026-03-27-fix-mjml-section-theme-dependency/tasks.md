## 1. Internal hook

- [x] 1.1 Add `useOptionalTheme` function to `src/theme/ThemeProvider.tsx` — returns `Theme | null`, not exported from `src/index.ts`

## 2. MjmlSection update

- [x] 2.1 Switch `MjmlSection` from `useTheme` to `useOptionalTheme`
- [x] 2.2 Add guard: throw targeted error when `indent` is `true` and theme is `null`

## 3. Verification

- [x] 3.1 Run lint and type checks (`pnpm run lint`)
- [x] 3.2 Run tests (`pnpm run test`)
