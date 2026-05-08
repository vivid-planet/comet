---
"@comet/mail-react": minor
---

Add config context with `Config`, `ConfigProvider`, and `useConfig`

`Config` is an augmentable interface for runtime configuration — intended for environment-specific data. Add custom keys via TypeScript interface declaration merging:

```ts
declare module "@comet/mail-react" {
    interface Config {
        myKey?: { foo: string };
    }
}
```

Define the config using the `config` prop on `MjmlMailRoot` or by mounting `ConfigProvider` directly. Use the `useConfig` hook to read the value.
