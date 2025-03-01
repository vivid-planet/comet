---
title: Site Configs
sidebar_position: 8
---

# Site Configs

A content website can have multiple different scopes.
These scopes can represent different websites (domains).
All websites share a single NextJS site instance.
However, there can be configuration differences between these sites.
To support this, COMET uses so-called "Site Configs".

In the root of each COMET web, there is a folder called `site-configs`. It contains the following files:

## site-configs.ts

This file contains a `getSiteConfigs` function that returns the configurations for the different sites.
The default export of this file is used by COMET (specifically `@comet/cli inject-site-configs`) to load the configurations of the individual sites.
New site config files must be imported in this file and returned by the `getSiteConfigs` function.

## site-configs.d.ts

Here is the single source of truth for the `ContentScope` type.
From here, it is imported in Admin, API, and Site.

Additionally, the `SiteConfig` type that represents the configuration of a site is defined here.
The `SiteConfig` must inherit from the `BaseSiteConfig` provided by `@comet/cli` that defines the standard fields that every site must have.
It can be extended as needed.

An example of a `SiteConfig`:

```ts title="site-configs.d.ts"
export interface SiteConfig extends BaseSiteConfig {
    preloginPassword?: string;
    public: {
        scope: {
            domain: string;
            languages: string[];
        };
        gtmId?: string;
    };
}
```

### Public vs Private Site Configs

Two environment variables are generated from the Site Config: `PRIVATE_SITE_CONFIGS` and `PUBLIC_SITE_CONFIGS`.

The Public Site Config only contains the fields defined under `public`, plus a few predefined fields provided by the library (`name`, `domains`, `preloginEnabled`, and `url`).
In the Admin and the Site, only the Public Site Config is available.

:::warning

The Public Site Config must not contain sensitive data, as it is available in the browser.

:::

The Private Site Config contains all fields of the Site Config.
It is only available in the API. Sensitive data (e.g., API keys) can be stored here.

The types for the Public and Private Site Configs are defined in `site-configs.d.ts`. There are helpers for this in `@comet/cli`:

```ts title="site-configs.d.ts"
export type PrivateSiteConfig = ExtractPrivateSiteConfig<SiteConfig>;
export type PublicSiteConfig = ExtractPublicSiteConfig<SiteConfig>;
```

## Site Config Files

Each site has its own site config file.
This file exports a `SiteConfig` and must be imported in `site-configs.ts`.

Here an example of a site config file:

```ts title="site-configs/my-site.ts"
import { SiteConfig } from "../site-configs.d";

const siteConfig: SiteConfig = {
    name: "My Site",
    domains: ["my-site.com"],
    preloginPassword: "password",
    public: {
        scope: {
            domain: "my-site",
            languages: ["en", "de"],
        },
        gtmId: "GTM-XXXX",
    },
};

export default siteConfig;
```

The name of the file should be composed of the scope parts that influence the domain.
Scope parts that do not influence the domain can usually be omitted (e.g., `language` if it is represented by a path like `/en`).

Here are some examples:

| Domain                                    | Scopes                                                                                                          | Site Config Filenames                     |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| domain-one.com <br/> domain-two.com       | { domain: "domain-one" } <br/> { domain: "domain-two" }                                                         | domain-one.ts <br/> domain-two.ts         |
| example.at <br/> example.de               | { country: "AT" } <br/> { country: "DE" }                                                                       | at.ts <br/> de.ts                         |
| domain-one.com (`/en` and `/de`)          | { domain: "domain-one", language: "en" } <br/> { domain: "domain-one", language: "de" }                         | domain-one.ts                             |
| en.domain-one.com <br/> de.domain-one.com | { domain: "domain-one", language: "en" } <br/> { domain: "domain-one", language: "de" }                         | domain-one-en.ts <br/> domain-one-de.ts   |
| my-brand.at (`/en` and `/de`)             | { brand: "my-brand", country: "AT", language: "en" } <br/> { brand: "my-brand", country: "AT", language: "de" } | my-brand-at.ts                            |
| en.my-brand.at <br/> de.my-brand.at       | { brand: "my-brand", country: "AT", language: "en" } <br/> { brand: "my-brand", country: "AT", language: "de" } | my-brand-at-en.ts <br/> my-brand-at-de.ts |
