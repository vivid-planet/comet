## 1. Component Implementation

- [x] 1.1 Create `src/components/MjmlSection.tsx` with the custom `MjmlSection` component and `MjmlSectionProps` type. Import `MjmlSection` from `@faire/mjml-react` as `BaseMjmlSection` and `MjmlGroup`. Implement `disableResponsiveBehavior` and `slotProps` props per the spec. Spread remaining props onto the base component.

## 2. Export Wiring

- [x] 2.1 Update `src/index.ts`: replace the direct `MjmlSection` / `MjmlSectionProps` re-exports from `@faire/mjml-react` with re-exports of the custom component and its props type from `./components/MjmlSection.js`. Do not expose the base component or type.

## 3. Validation

- [x] 3.1 Run `pnpm run lint` to verify the new component passes TypeScript, ESLint, and Prettier checks. Fix any reported issues.
- [x] 3.2 Run `pnpm run build` to confirm the package builds successfully with the new component.

## 4. Changeset

- [x] 4.1 Create a changeset file at the monorepo root (`.changeset/`) for `@comet/mail-react` with a `minor` bump. Title: "Add custom `MjmlSection` component with `disableResponsiveBehavior` and `slotProps` props".
