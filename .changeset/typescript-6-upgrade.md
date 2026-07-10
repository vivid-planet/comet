---
"@comet/admin": patch
"@comet/admin-color-picker": patch
"@comet/admin-date-time": patch
"@comet/admin-generator": patch
"@comet/admin-icons": patch
"@comet/admin-rte": patch
"@comet/brevo-admin": patch
"@comet/cms-admin": patch
"@comet/api-generator": patch
"@comet/brevo-api": patch
"@comet/cms-api": patch
"@comet/cli": patch
"@comet/eslint-config": patch
"@comet/eslint-plugin": patch
"@comet/mail-react": patch
"@comet/site-nextjs": patch
"@comet/site-react": patch
---

Upgrade TypeScript to 6.0

Update all packages to TypeScript `6.0` and enable `stableTypeOrdering`, which matches TypeScript 7's deterministic type ordering to ease the eventual upgrade to TypeScript 7.

TypeScript 6.0 changes several compiler defaults (`strict`, automatic `@types` inclusion, `noUncheckedSideEffectImports`). The shared TypeScript configs restore the previous defaults so existing behavior is preserved, and options that are deprecated in 6.0 and removed in 7.0 (`baseUrl`, `target: es5`, `moduleResolution: node`) have been migrated.
