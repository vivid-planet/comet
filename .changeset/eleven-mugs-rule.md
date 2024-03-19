---
"@comet/cms-api": minor
---

Log the correct user IP even if the app is behind a proxy

The package [request-ip](https://www.npmjs.com/package/request-ip) is now used to get the actual user IP even if the app runs behind a proxy. Previously, the proxy's IP was logged.
