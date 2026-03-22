## 1. MjmlMailRoot Component

- [x] 1.1 Create `src/components/mailRoot/MjmlMailRoot.tsx` with a `PropsWithChildren` component that renders `<Mjml>`, `<MjmlHead>` with `<MjmlAttributes><MjmlAll padding={0} /></MjmlAttributes>`, and `<MjmlBody>` with children
- [x] 1.2 Add TSDoc comment to `MjmlMailRoot`
- [x] 1.3 Export `MjmlMailRoot` from `src/index.ts`

## 2. Storybook

- [x] 2.1 Create `src/components/mailRoot/__stories__/MjmlMailRoot.stories.tsx` with a story demonstrating basic usage and the `autodocs` tag
- [x] 2.2 Update `.storybook/MailRenderer.decorator.tsx` to use `MjmlMailRoot` instead of manually wrapping with `<Mjml><MjmlBody>`

## 3. Changeset

- [x] 3.1 Create a changeset file in `.changeset/` (at the git root) describing the new `MjmlMailRoot` component export

## 4. Verification

- [x] 4.1 Run lint and type-check to verify no errors
