---
"@comet/cms-site": major
---

Remove `next/link` legacy behavior as default behavior

Previously, Next required the `Link` component to have a child `<a>` tag. To style this tag correctly in the application, none of the library link blocks (`DamFileDownloadLinkBlock`, `ExternalLinkBlock`, `EmailLinkBlock`, `InternalLinkBlock`, and `PhoneLinkBlock`) rendered the tag, but cloned the children with the correct props instead.

However, since Next v13 the `Link` component no longer requires a child `<a>` tag. Consequently, we don't need to render the tag for the `InternalLinkBlock` (which uses `Link` internally) anymore. In order to style all link blocks correctly, we now render an `<a>` tag for all other link blocks.

**Upgrade**

To upgrade, either remove all `<a>` tags from your link block usages, or add the `legacyBehavior` prop to all library link blocks.
