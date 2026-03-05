---
title: Why can't I use process.env in the Next.js site?
---

In COMET DXP, the Next.js site application is built once during CI and the resulting build artifact is reused across multiple environments (e.g., staging and production).
This has two important implications:

## `process.env.NEXT_PUBLIC_*` variables are not supported

Next.js embeds `NEXT_PUBLIC_*` environment variables into the client bundle **at build time**.
Since the build happens once in CI, the values from the CI environment would be baked into the bundle for all environments.
This means staging and production would share the same values, which is incorrect.

**Use site configs or a custom provider instead.**
COMET provides a site config mechanism that allows you to pass environment-specific configuration at runtime.
See [Site Configs](../3-features-modules/site-configs.md) for details.

## `process.env.*` in `next.config.mjs` is not supported

The Next.js configuration file (`next.config.mjs`) is evaluated at build time.
Any `process.env.*` access in this file reads values from the CI build environment, not from the target deployment environment.
This means configuration that varies between environments (e.g., API URLs, feature flags) cannot be reliably set via `process.env` in the Next.js config.

**Move environment-specific configuration to site configs or runtime configuration.**
