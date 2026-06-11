# Apollo cache normalization warnings: `DamFile.image` and `Query.userPermissionsUserById` cannot be merged (potential data loss)

- **Severity:** minor
- **Location:** Admin → Assets → file detail (`/main/en/assets/<fileId>/edit`) and Admin → User Permissions → user detail (`/main/en/user-permissions/<userId>/edit`)

## Summary

Two queries return object types without an `id` (and without configured `keyFields`/merge functions), so Apollo Client logs "data loss" warnings when different queries write the same field:

1. **`DamFile.image` (`DamFileImage`)** — when opening a DAM file detail view:

```
Cache data may be lost when replacing the image field of a DamFile object.
To address this problem, either ensure all objects of type DamFileImage have an ID
or a custom merge function, or define a custom merge function for the DamFile.image field. ...
{ "__typename": "DamFileImage", "url({\"height\":320,\"width\":...})": ... }
```

2. **`Query.userPermissionsUserById` (`UserPermissionsUser`)** — when opening a user detail in User Permissions:

```
Cache data may be lost when replacing the userPermissionsUserById field of a Query object.
To address this problem, either ensure all objects of type UserPermissionsUser have an ID
or a custom merge function ...
```

Different selections of the same entity can silently overwrite each other in the cache (e.g. cropped preview URLs of an image fetched by different components), which is exactly the data-loss scenario the warning describes.

## Steps to reproduce

1. Log in to the Demo Admin, open the browser console.
2. Navigate to **Assets** and open any image (e.g. `comet.png`) → warning 1 appears.
3. Navigate to **User Permissions** and open a user (e.g. "Admin") → warning 2 appears.

## Expected vs. actual behavior

- **Expected:** Cache type policies (`keyFields`/`merge`) are defined for `DamFileImage` and `UserPermissionsUser` (or the queries select stable ids), so no warnings and no overwriting of sibling query data.
- **Actual:** Both pages log Apollo "cache data may be lost" warnings on every visit.

## Additional observation (same page)

The grid inside the User Permissions detail also logs a MUI X misuse warning:

```
MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect.
`rowCount` is only meant to be used with `paginationMode="server"`.
```

## Evidence

- Screenshot: [screenshots/009-user-permissions-detail.png](screenshots/009-user-permissions-detail.png)
- Screencast (DAM detail, then user detail): [screencasts/009-apollo-cache-normalization-warnings.webm](screencasts/009-apollo-cache-normalization-warnings.webm)
