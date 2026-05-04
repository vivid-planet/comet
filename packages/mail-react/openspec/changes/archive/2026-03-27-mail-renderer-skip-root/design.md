## Context

The `MailRendererDecorator` unconditionally wraps every story in `<MjmlMailRoot>`. This works for all stories that render inner content (sections, columns, text). It breaks for the `MjmlMailRoot` story, which must render its own root to demonstrate its own behaviour — resulting in a nested `<MjmlMailRoot><MjmlMailRoot>` that produces no visible output.

## Goals / Non-Goals

**Goals:**
- Allow individual story files to opt out of the decorator's `<MjmlMailRoot>` wrapper via a Storybook parameter
- Keep the default behaviour (wrap everything) unchanged

**Non-Goals:**
- Exporting the decorator or the parameter contract to consumers
- Supporting per-story granularity (Meta-level opt-out is sufficient)

## Decisions

### Use `parameters.mailRoot` (boolean) as the opt-out signal

Storybook parameters are the idiomatic mechanism for passing configuration to decorators. Setting `parameters: { mailRoot: false }` at the Meta level opts the entire story file out of the wrapper.

**Alternatives considered:**
- **Tags** (`tags: ['no-mail-root']`): Tags are designed for filtering/categorization in the Storybook UI. Using them to control runtime behaviour is a semantic mismatch and adds visual noise to the sidebar.
- **A separate decorator**: Adds boilerplate to every story file that needs the root; the global decorator already exists for a reason.

### When `mailRoot` is `false`, still call `renderMailHtml` directly on `<Story />`

The decorator's responsibility is MJML-to-HTML rendering, not just wrapping. Skipping only the `<MjmlMailRoot>` wrapper while still calling `renderMailHtml` means the story's own `<MjmlMailRoot>` is used as the root — correct behaviour for `MjmlMailRoot` stories.

## Risks / Trade-offs

- [Developer forgets the parameter] → Stories with an embedded `MjmlMailRoot` silently double-wrap and render nothing. Mitigation: the parameter name `mailRoot` is intuitive; the fix is one line.
- [Parameter is Storybook-internal only] → No type-safety for the parameter key. Acceptable given the narrow scope and internal-only use.
