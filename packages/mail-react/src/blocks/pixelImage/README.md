# Pixel image

Solves the problem that rendering a Comet CMS pixel-image in an email requires picking a DAM render width sized for the recipient's display, building an absolute URL from the DAM template, and keeping the image readable when the viewport falls below the body-width breakpoint — work every consumer would otherwise repeat per template. Two block components encapsulate it: `MjmlPixelImageBlock` for MJML context (must sit inside an `MjmlColumn`) and `HtmlPixelImageBlock` for raw HTML context such as MJML ending tags. Both read the consumer-supplied `validSizes` and `baseUrl` from `config.pixelImageBlock`, render nothing when the CMS record has no attached DAM file, and throw when the configuration is missing or the DAM record is malformed (non-`SMART` crop without dimensions, unparseable `aspectRatio` string) — these are genuine setup errors, not runtime branches.

## Non-goals

- The width-selection and URL-building logic is intentionally duplicated from `@comet/site-react` rather than imported, to keep this package free of a site dependency. The copies in `usePixelImageBlockData.ts` must be kept in sync with the originals in `@comet/site-react`'s `image.utils.ts` by hand.
