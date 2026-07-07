---
"@comet/cms-api": patch
---

Make the `noFollow` field of the `ExternalLinkBlock` optional

The `noFollow` field, which was added to the `ExternalLinkBlock` in a previous release, was required. This was a breaking change for existing consumers that create external links without providing `noFollow`. The field is now nullable to avoid the breaking change.
