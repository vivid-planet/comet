## ADDED Requirements

### Requirement: OutlookTextStyleValues type

The module SHALL define an `OutlookTextStyleValues` type as a partial record of the CSS properties that Outlook Desktop overrides on `<a>` tags: `fontFamily`, `fontSize`, `lineHeight`, `fontWeight`, and `color`. Each property SHALL use the corresponding `CSSProperties` value type. This type is internal and SHALL NOT be exported from the library's main entry point.

### Requirement: OutlookTextStyleProvider component

The module SHALL define an `OutlookTextStyleProvider` component that accepts a `value` prop of type `OutlookTextStyleValues` and a `children` prop. It SHALL provide the `value` to all descendants via React context. This component is internal and SHALL NOT be exported from the library's main entry point — only text components (`HtmlText`, `MjmlText`) should provide the context.

### Requirement: useOutlookTextStyle hook

The module SHALL define a `useOutlookTextStyle` hook that returns `OutlookTextStyleValues | null`. It SHALL return the value from the nearest `OutlookTextStyleProvider` ancestor, or `null` when no provider is present. It SHALL NOT throw when called outside a provider. This hook is internal and SHALL NOT be exported from the library's main entry point.

### Requirement: Module location

The context, provider, hook, and type SHALL be defined in `src/components/text/OutlookTextStyleContext.tsx`.
