# Storybook

Debugging emails during development is awkward: stories rendered as React show the component tree rather than the email; copying the rendered HTML for paste-testing in real clients is fiddly; and external clients (real inboxes, preview services) can't load images served from localhost. A decorator runs each story through `renderMailHtml` and injects the result as HTML, toolbar addons add workflows for copying the HTML and for swapping local image sources to public placeholders, and a panel surfaces MJML's non-fatal validation output — which MJML calls "errors" but we treat as warnings. The whole thing ships as a Storybook preset so consumers wire it up with a single `addons` entry.

## Non-goals

- No public API surface beyond the addon name. Manager and preview files are referenced by filesystem path from the preset and are not in the package `exports` map.
