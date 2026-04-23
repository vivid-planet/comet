## Context

The library re-exports all `@faire/mjml-react` components and adds custom wrappers where needed. There is no root-level email component yet — consumers must manually compose `<Mjml>`, `<MjmlHead>`, `<MjmlAttributes>`, and `<MjmlBody>` for every template. The Storybook decorator currently assembles this manually too.

## Goals / Non-Goals

**Goals:**
- Provide a single `MjmlMailRoot` component that renders the standard MJML email skeleton
- Set `<MjmlAll padding={0} />` as the only default attribute in the head
- Export the component from the package entry point
- Update the Storybook decorator to use `MjmlMailRoot`
- Add a Storybook story with autodocs

**Non-Goals:**
- Theming, custom styles, or config provider integration (planned for the future)
- Breakpoint configuration
- Custom fonts or any other `<MjmlAttributes>` children beyond `<MjmlAll padding={0} />`
- `MjmlBody` props like `width` or `backgroundColor` — these will be added later, likely driven by theming

## Decisions

### Component accepts only children

The component accepts only `PropsWithChildren` — no body-level props like `width` or `backgroundColor`. This keeps the API minimal; body props will likely be driven by theming when it lands, so exposing `MjmlBodyProps` now would create API surface that may become redundant. No custom props type is exported since `PropsWithChildren` is a standard React type.

**Alternative considered**: Extending `MjmlBodyProps` for body prop forwarding. Deferred because theming will likely provide the right abstraction for body-level configuration.

### Head content is not configurable

The `<MjmlHead>` renders only `<MjmlAttributes><MjmlAll padding={0} /></MjmlAttributes>`. There are no props for injecting additional head content, fonts, styles, or breakpoints. This keeps the component minimal; theming and config will introduce head customization later.

**Alternative considered**: An optional `head` render prop or `headChildren` prop. Rejected as premature — the theming system will provide the right abstraction for this.

### Storybook decorator uses `MjmlMailRoot`

The decorator switches from `<Mjml><MjmlBody>` to `<MjmlMailRoot>`, which ensures stories render with the same defaults (zero padding) that consumers get in production. This also validates that `MjmlMailRoot` works correctly as part of the Storybook workflow.

### File location follows existing convention

The component lives in `src/components/mailRoot/MjmlMailRoot.tsx`, following the established `src/components/<concern>/<Component>.tsx` pattern. The story goes in `src/components/mailRoot/__stories__/MjmlMailRoot.stories.tsx`.

## Risks / Trade-offs

- **Zero-padding default is opinionated** → This is intentional. MJML's built-in padding defaults are rarely desired in production emails. Consumers can override per-component. The reference implementation confirms this is the right default.
- **No head extensibility** → Theming will add this. If a consumer needs custom head content before theming lands, they can still use the raw `<Mjml>` + `<MjmlHead>` approach.
