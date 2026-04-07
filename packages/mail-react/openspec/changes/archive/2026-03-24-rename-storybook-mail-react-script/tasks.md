## 1. dev-pm script rename

- [x] 1.1 In monorepo root `dev-pm.config.ts`, rename script key `storybook-mail-react` to `mail-react-storybook`.
- [x] 1.2 Keep the script command and group configuration unchanged while renaming.

## 2. Spec/documentation alignment

- [x] 2.1 Update OpenSpec `storybook-setup` requirement text and scenarios to reference `mail-react-storybook`.
- [x] 2.2 Check for additional repo documentation references to `storybook-mail-react` and update where needed.

## 3. Verification

- [x] 3.1 Verify dev-pm can start the renamed script identifier and that expected group behavior remains unchanged.
- [x] 3.2 Run repository checks relevant to the touched files (format/lint as applicable).
