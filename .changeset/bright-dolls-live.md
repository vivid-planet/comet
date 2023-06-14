---
"@comet/cms-api": major
---

Remove CDN config from DAM

It was a bad idea to introduce this in the first place, because `@comet/cms-api` should not be opinionated about how the CDN works.

Modern applications require all traffic to be routed through a CDN. Cloudflare offers a tunnel, which made the origin-check obsolete, so we introduced a flag to disable the origin check.

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
CDN_ENABLED="true"
CDN_ORIGIN_CHECK="Use value from DAM_CDN_ORIGIN_HEADER to avoid downtime"
```

_environment-variables.ts_

```
@IsOptional()
@IsBoolean()
@Transform(({ value }) => value === "true")
CDN_ENABLED: boolean;

@IsString()
@IsNotEmpty()
@ValidateIf((v) => v.CDN_ENABLED)
CDN_ORIGIN_CHECK: string;
```

_config.ts_

```
cdn: {
    enabled: envVars.CDN_ENABLED,
    originCheck: envVars.CDN_ORIGIN_CHECK,
},
```

2. Add ExternalRequestWithoutHeaderGuard

```
// if CDN is enabled, make sure all traffic is either coming from the CDN or internal sources
if (config.cdn.enabled) {
    app.useGlobalGuards(new ExternalRequestWithoutHeaderGuard({ headerName: "x-cdn-origin-check", headerValue: config.cdn.originCheck }));
}
```

3. DNS changes might be required. `api.example.com` should point to CDN, CDN should point to internal API domain
