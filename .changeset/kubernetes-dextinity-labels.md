---
"@dextinity/cms-api": minor
---

Support `dextinity.com/*` Kubernetes labels and annotations

The Builds, Cron Jobs and Kubernetes modules now read the labels and annotations of Kubernetes resources with the `dextinity.com` prefix:

| Previously                      | Now                             |
| ------------------------------- | ------------------------------- |
| `comet-dxp.com/instance`        | `dextinity.com/instance`        |
| `comet-dxp.com/parent-cron-job` | `dextinity.com/parent-cron-job` |
| `comet-dxp.com/label`           | `dextinity.com/label`           |
| `comet-dxp.com/builder`         | `dextinity.com/builder`         |
| `comet-dxp.com/trigger`         | `dextinity.com/trigger`         |
| `comet-dxp.com/content-scope`   | `dextinity.com/content-scope`   |

The `comet-dxp.com` prefix is still supported, so existing Helm charts keep working without changes.
Resources are expected to use one prefix or the other: if no resource matches the `dextinity.com` labels, the `comet-dxp.com` ones are used instead.

**Example**

```yaml
metadata:
    annotations:
        dextinity.com/label: "Demo Cron Job"
        dextinity.com/content-scope: '{ "domain": "main", "language": "en" }'
```
