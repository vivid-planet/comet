---
"@comet/cms-admin": major
---

Make sites config generic

The sites config was previously assumed to be `Record<string, SiteConfg`.
However, as the sites config is solely used in application code, it could be of any shape.
Therefore, the `SitesConfigProvider` and `useSitesConfig` are made generic.
The following changes have to be made in the application:

1.  Define the type of your sites config

    Preferably this should be done in `config.ts`:

    ```diff
    export function createConfig() {
        // ...

        return {
            ...cometConfig,
            apiUrl: environmentVariables.API_URL,
            adminUrl: environmentVariables.ADMIN_URL,
    +       sitesConfig: JSON.parse(environmentVariables.SITES_CONFIG) as SitesConfig,
        };
    }

    + export type SitesConfig = Record<string, SiteConfig>;
    ```

2.  Use the type when using `useSitesConfig`

    ```diff
    - const sitesConfig = useSitesConfig();
    + const sitesConfig = useSitesConfig<SitesConfig>();
    ```

3.  Optional: Remove type annotation from `ContentScopeProvider#resolveSiteConfigForScope` (as it's now inferred)

    ```diff
    - resolveSiteConfigForScope: (configs: Record<string, SiteConfig>, scope: ContentScope) => configs[scope.domain],
    + resolveSiteConfigForScope: (configs, scope: ContentScope) => configs[scope.domain],
    ```
