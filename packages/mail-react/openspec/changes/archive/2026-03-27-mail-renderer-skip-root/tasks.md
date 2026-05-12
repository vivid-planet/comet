## 1. Decorator

- [x] 1.1 In `MailRendererDecorator`, check `context.parameters.mailRoot`; when it is `false`, call `renderMailHtml(<Story />)` directly without the `<MjmlMailRoot>` wrapper

## 2. Story

- [x] 2.1 Add `parameters: { mailRoot: false }` to the Meta config in `MjmlMailRoot.stories.tsx`
