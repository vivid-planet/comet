---
"@comet/cms-api": major
---

Remove absolute DAM URLs

Until now, the API returned absolute URLs for DAM assets by default.
You could optionally get relative URLs by setting the `x-relative-dam-urls` header.
This regularly caused confusion regarding the handling of DAM URLs in the site and admin.

Now, the API will always return relative URLs for DAM assets.
The `x-relative-dam-urls` header is not supported anymore.

A proxy should be set up in site and admin to proxy the relative /dam URLs to the API.
