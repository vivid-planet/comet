# Config

Solves the need for runtime configuration that doesn't belong in the theme — values like API origins or supported image sizes, which describe the environment a mail renders in rather than its visual design. Exposes an augmentable `Config` interface that consumers extend via TypeScript declaration merging, plus a context channel (`ConfigProvider` / `useConfig`) to read those values from anywhere in the tree without prop drilling.

## Non-goals

- Not a theme. Visual tokens (colors, spacing, typography) belong in [theme](../theme/README.md); `Config` carries non-visual runtime values.
- Not a required provider. With no provider mounted, `useConfig` returns an empty `Config` — features that need a key must check for it and surface their own error.
