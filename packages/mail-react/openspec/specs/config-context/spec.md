# config-context Specification

## Purpose
TBD - created by archiving change add-config-context. Update Purpose after archive.
## Requirements
### Requirement: `Config` interface

The package SHALL export an interface named `Config` that holds runtime configuration for `@comet/mail-react` consumers. The interface ships with no built-in keys. All keys, current or future, SHALL be optional.

The interface SHALL be defined as a TypeScript `interface` (not a `type` alias) so that this package's later changes and downstream consumers can add keys via TypeScript interface declaration merging:

```ts
declare module "@comet/mail-react" {
    interface Config {
        myKey?: { /* ... */ };
    }
}
```

#### Scenario: Consumer augments `Config` with a custom key

- **WHEN** a consumer declares `interface Config { myKey?: { foo: string } }` via `declare module "@comet/mail-react"`
- **THEN** `myKey` becomes an optional property on the merged `Config` type and is readable from `useConfig()` without any cast or wrapper type

### Requirement: `ConfigProvider` and `useConfig`

The package SHALL export:

- `ConfigProvider` — a React component accepting `config: Config` and `children`, placing the given `Config` value into a React context.
- `useConfig` — a hook returning the nearest `Config` value from context.

When no `ConfigProvider` is mounted in the ancestor tree, `useConfig` SHALL return an empty `Config` (`{}`) without throwing.

#### Scenario: No provider mounted

- **WHEN** `useConfig()` is called in a tree without a `ConfigProvider`
- **THEN** it returns `{}` (a valid empty `Config`) and does not throw

### Requirement: `MjmlMailRoot` accepts an optional `config` prop

`MjmlMailRoot` SHALL accept an optional `config?: Config` prop and SHALL mount a `ConfigProvider` internally so descendants always read a `Config` value via `useConfig`. When `config` is provided, descendants SHALL receive that value. When `config` is omitted, descendants SHALL receive an empty `Config` (`{}`).

The `config` prop SHALL be additive and independent of the existing `theme` prop — passing one does not require passing the other.

#### Scenario: `config` prop wires the value to descendants

- **WHEN** `<MjmlMailRoot config={value}>` renders a descendant that calls `useConfig()`
- **THEN** the descendant receives `value`

#### Scenario: `config` prop omitted

- **WHEN** `<MjmlMailRoot>` renders without a `config` prop and a descendant calls `useConfig()`
- **THEN** the descendant receives `{}` (an empty `Config`) and `useConfig` does not throw

