---
"@comet/cms-api": major
---

Remove CDN config from DAM

It was a bad idea to introduce this in the first place, because `@comet/cms-api` should not be opinionated about how the CDN works.

Modern applications require all traffic to be routed through a CDN. Cloudflare offers a tunnel, which made the origin-check obsolete, so we introduced a flag to disable the origin check.

Also changes the behavior of the `FilesService::createFileUrl()`-method which now expects an options-object as second argument.

## How to migrate (only required if CDN is used):

Remove the following env vars from the API

```
DAM_CDN_ENABLED=
DAM_CDN_DOMAIN=
DAM_CDN_ORIGIN_HEADER=
DAM_DISABLE_CDN_ORIGIN_HEADER_CHECK=false
```

If you want to enable the origin check:

1. Set the following env vars for the API

```
CDN_ORIGIN_CHECK_SECRET="Use value from DAM_CDN_ORIGIN_HEADER to avoid downtime"
```

_environment-variables.ts_

```
@IsOptional()
@IsString()
CDN_ORIGIN_CHECK_SECRET: string;
```

_config.ts_

```
cdn: {
    originCheckSecret: envVars.CDN_ORIGIN_CHECK_SECRET,
},
```

2. Add CdnGuard

```
// if CDN is enabled, make sure all traffic is either coming from the CDN or internal sources
if (config.cdn.originCheckSecret) {
    app.useGlobalGuards(new CdnGuard({ headerName: "x-cdn-origin-check", headerValue: config.cdn.originCheckSecret }));
}
```

3. DNS changes might be required. `api.example.com` should point to CDN, CDN should point to internal API domain
