---
"@dextinity/admin-icons": major
---

Rename `@comet/admin-icons` to `@dextinity/admin-icons`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Remove the `Comet` and `CometOutline` icons
- Remove the `CometColor` component. Use `DextinityIcon` instead, which provides the `light`, `dark` and `masked` variants
- Remove the `CometDigitalExperienceLogo` component. Use `DextinityLogo` instead, which provides the `light`, `dark` and `monochrome` variants
- Rename the `CometColor` member of the `IconName` type to `DextinityIcon`

`DextinityIcon` and `DextinityLogo` derive their size from `fontSize`, so call sites no longer pass `width`/`height` pairs:

```diff
- <CometDigitalExperienceLogo width={132} height={30} />
+ <DextinityLogo sx={{ fontSize: 30 }} />
```
