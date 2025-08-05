---
"@comet/cms-admin": major
---

Merge providers into new `CometConfigProvider`

Previously, each module (e.g., DAM) had its own provider used for configuration.
This led to crowding the application since most applications use multiple CMS features.
A new `CometConfigProvider` provider is introduced to use instead.

**Example**

```tsx
<CometConfigProvider
    apiUrl={config.apiUrl}
    graphQLApiUrl={`${config.apiUrl}/graphql`}
    adminUrl={config.adminUrl}
    // Config for the page tree module
    pageTree={{
        categories: pageTreeCategories,
        documentTypes: pageTreeDocumentTypes,
    }}
    // Config for the DAM module
    dam={{
        ...config.dam,
        scopeParts: ["domain"],
        contentGeneration: {
            generateAltText: true,
            generateImageTitle: true,
        },
    }}
    // Additional modules...
>
    {/* Application */}
</CometConfigProvider>
```

**Breaking changes**

- Multiple exports have been removed: `CmsBlockContext`, `CmsBlockContextProvider`, `useCmsBlockContext`, `BuildInformationProvider`, `DamConfigProvider`, `useDamConfig`, `DependenciesConfigProvider`, `useDependenciesConfig`, `LocaleProvider`, `SitesConfigProvider`
- `useLocale` has been renamed to `useContentLanguage`
- `useSitesConfig` has been renamed to `useSiteConfigs`

**How to upgrade**

1. Add the `CometConfigProvider` to `src/App.tsx`
2. Move configs for used modules to the new provider
3. Remove the old config providers
