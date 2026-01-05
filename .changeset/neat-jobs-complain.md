---
"@comet/brevo-admin": major
"@comet/brevo-api": major
---

Prefix all entities and API requests with `brevo` to prevent naming issues in projects.

Update the entity name in the `additionalPageTreeNodeFieldsFragment` GraphQL fragment from `TargetGroup` to `BrevoTargetGroup` in the `targetGroupFormConfig`.

```
export const additionalPageTreeNodeFieldsFragment = {
    fragment: gql`
        fragment TargetGroupFilters on BrevoTargetGroup {
            filters {
                SALUTATION
                BRANCH
            }
        }
   `,
    name: "TargetGroupFilters",
};
```
