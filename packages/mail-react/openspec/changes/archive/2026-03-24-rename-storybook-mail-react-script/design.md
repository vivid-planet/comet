## Context

The repository currently uses `storybook-mail-react` as the dev-pm script identifier for launching mail-react Storybook. The name works, but it inverts the package/topic order compared to other naming patterns and is less intuitive when scanning script lists.

## Goals / Non-Goals

**Goals:**

- Standardize the script identifier to `mail-react-storybook`.
- Preserve the current command, group membership, and startup behavior.
- Keep migration low risk by changing only references to the identifier.

**Non-Goals:**

- Changing Storybook command arguments, port, or package scripts.
- Reorganizing dev-pm groups.
- Adding new scripts beyond the rename.

## Decisions

1. **Perform a key rename only** in `dev-pm.config.ts` from `storybook-mail-react` to `mail-react-storybook`.
2. **Preserve semantics** (same command and groups) to avoid behavioral regressions.
3. **Update spec/doc references** so operational documentation matches runtime config.

## Risks / Trade-offs

- **Risk:** Existing local scripts/aliases may still reference the old identifier.
    - **Mitigation:** Document the rename in OpenSpec artifacts and include verification steps.
- **Trade-off:** A pure rename still requires coordinated updates across docs/specs.
    - **Mitigation:** Search-and-update all known references in the same change.

## Migration Plan

1. Rename the script key in `dev-pm.config.ts`.
2. Update OpenSpec requirements/scenarios that mention `storybook-mail-react`.
3. Verify group behavior is unchanged and script can be started with the new name.

## Open Questions

- Should we keep a temporary alias for one cycle (duplicate key pointing to same command), or proceed with a direct rename only?
