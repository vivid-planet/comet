---
"@comet/cms-admin": minor
---

Add `externalLink` option to the blocks config to hide the "Open in new window" and "No follow" options of the `ExternalLinkBlock`

Both options aren't needed in every application: an internal tool embedded in an iframe may always want to open external links in a new tab, and an application that isn't indexed by search engines has no use for `rel="nofollow"`.

**Example**

```tsx
<CometConfigProvider
    /* Other config... */
    blocks={{
        externalLink: {
            showOpenInNewWindow: false,
            showNoFollow: false,
        },
    }}
>
    {/* Other providers... */}
</CometConfigProvider>
```

Disabled options are hidden everywhere the `ExternalLinkBlock` is used (`LinkBlock`, rich text links, redirects etc.). Existing values aren't changed.
