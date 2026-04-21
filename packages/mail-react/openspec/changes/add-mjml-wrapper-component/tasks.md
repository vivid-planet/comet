## 1. Custom MjmlWrapper component

- [ ] 1.1 Create `src/components/wrapper/InsideMjmlWrapperContext.ts` with an internal `InsideMjmlWrapperContext = React.createContext<boolean>(false)` and an internal `useIsInsideMjmlWrapper()` hook
- [ ] 1.2 Create `src/components/wrapper/MjmlWrapper.tsx` that wraps `@faire/mjml-react`'s `MjmlWrapper`, applies `theme.colors.background.content` as the default `backgroundColor` when a theme is present and no explicit prop is given, and provides `InsideMjmlWrapperContext.Provider value={true}` around its children
- [ ] 1.3 Export `MjmlWrapperProps` type and the `MjmlWrapper` component from `src/components/wrapper/MjmlWrapper.tsx`

## 2. Section integration

- [ ] 2.1 Update `src/components/section/MjmlSection.tsx` to read `useIsInsideMjmlWrapper()` and skip applying the theme-default `backgroundColor` when the section is inside a custom `MjmlWrapper`
- [ ] 2.2 Ensure an explicit `backgroundColor` prop still wins inside a wrapper

## 3. Package exports

- [ ] 3.1 Replace the `MjmlWrapper` / `MjmlWrapperProps` re-export in `src/index.ts` with the custom component's exports
- [ ] 3.2 Ensure `InsideMjmlWrapperContext` and `useIsInsideMjmlWrapper` are NOT exported from `src/index.ts`

## 4. Stories

- [ ] 4.1 Create `src/components/wrapper/__stories__/MjmlWrapper.stories.tsx` demonstrating: default theme background, explicit background, transparent opt-out, and sections inside a full-width wrapper

## 5. Verification

- [ ] 5.1 Run `pnpm run lint:fix` and then `pnpm run lint` — fix any remaining lint or TypeScript errors
- [ ] 5.2 Run `pnpm run test`
- [ ] 5.3 Add two changeset files under `.changeset/` for `@comet/mail-react`:
    - `minor` — `MjmlWrapper` now uses the theme's background color by default
    - `patch` — fix `MjmlSection` overriding `MjmlWrapper`'s background
