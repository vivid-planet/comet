---
"@comet/cms-api": patch
---

Load `@kubernetes/client-node` lazily in `KubernetesService`

`@kubernetes/client-node` (~85 MB resident) was statically imported, so importing anything from `@comet/cms-api` pulled it into memory even for projects that don't use the Kubernetes-based builds feature. The runtime parts of the client are now required lazily when `KubernetesService` actually connects to a cluster, reducing the package's base memory footprint.
