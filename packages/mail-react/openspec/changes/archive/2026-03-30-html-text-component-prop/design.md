## Context

`HtmlText` renders a `<td>` with theme-driven inline styles. Its props type extends `TdHTMLAttributes<HTMLTableCellElement>`. See the proposal for the full list of changes and motivation.

## Goals / Non-Goals

**Goals:**

- Allow `HtmlText` to render any HTML element via a `component` prop, defaulting to `<td>`
- Provide type-safe props that change based on the chosen element (e.g., `href` only when `component="a"`)
- Avoid `as` type assertions in the implementation
- Keep the API backwards-compatible — existing usage without `component` continues to work unchanged

**Non-Goals:**

- Reusable polymorphic type utilities shared across components (keep it local to `HtmlText` for now)
- Support for custom React components as the `component` value (only intrinsic HTML elements)
- `ref` forwarding (not currently used by `HtmlText`, can be added later if needed)

## Decisions

### Function overloads for type safety

**Decision:** Use TypeScript function overloads on the `HtmlText` function itself.

Two public overload signatures:
1. With `component` prop — a generic that infers the element type and exposes its HTML attributes
2. Without `component` prop — defaults to `<td>` with `TdHTMLAttributes`

The implementation signature uses a wide type (`{ component?: ElementType } & Record<string, unknown>`) that covers both overloads. This is standard TypeScript overload practice — the implementation signature is not visible to consumers.

**Why over alternatives:**
- *Generic function without overloads:* The expression `component ?? "td"` produces a union type (`C | "td"`) that TypeScript cannot narrow, causing type errors when spreading `restProps` onto the JSX element. Solving this requires `as` assertions.
- *MUI's `OverridableComponent` callable interface pattern:* Requires a separate type infrastructure (`OverridableTypeMap`, `OverrideProps`, `DefaultComponentProps`, `DistributiveOmit`) and typically relies on `.d.ts` files with plain JS implementation to avoid internal type issues. Too heavy for a single component.
- *Discriminated union of supported elements:* Good type narrowing but requires explicitly listing every supported element, limiting extensibility.

### Constrain to intrinsic HTML elements

**Decision:** The `component` prop accepts `keyof JSX.IntrinsicElements` rather than the broader `ElementType`.

This limits the prop to HTML tags (`"div"`, `"a"`, `"span"`, etc.) and excludes custom React components. In the email HTML context, only native elements make sense — there are no React component libraries in the rendered output.

This also simplifies the type machinery since `ComponentPropsWithoutRef<C>` resolves cleanly for intrinsic elements.

### Conditional rendering to avoid type assertions

**Decision:** Use an `if/else` branch — when `component` is provided, render with that tag; otherwise render `<td>`.

This avoids the `component ?? "td"` union type problem entirely. The JSX duplication is minimal (one element with the same props spread), and the theme/style computation is shared above the branch.

### Type-level tests via `@ts-expect-error`

**Decision:** Add type-level tests in the existing test file using `@ts-expect-error` comments.

These verify the overload signatures reject invalid prop combinations (e.g., `href` without `component="a"`). The tests are checked by `tsc` during the `lint` step — if someone breaks the overloads, unused `@ts-expect-error` directives cause compile errors.

## Risks / Trade-offs

- **Wide implementation signature loses internal type safety on `restProps`:** The implementation body cannot type-check that `restProps` matches the rendered element. This is mitigated by the overload signatures enforcing correctness at every call site, plus the type-level tests catching regressions. This is the same trade-off every TypeScript overload makes.
- **JSX duplication in conditional rendering:** Two nearly identical JSX expressions (one for `component`, one for `<td>`). The duplication is a single element with the same attributes — acceptable for avoiding type assertions.
- **`HtmlTextProps` becomes generic:** Consumers typing variables as `HtmlTextProps` get `<td>` props by default. Consumers who need element-specific props must write `HtmlTextProps<"a">`. This is a minor ergonomic change.
