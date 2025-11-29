---
"@comet/cms-api": minor
---

Allow Easier Local Usage of the Kubernetes Module

As projects increasingly use the Kubernetes API, local testing and debugging have become necessary.
Previously, if you wanted to use the Kubernetes service locally (outside of a cluster), you had to overwrite the Kubernetes service inside the node_modules folder.
Now, you can instantiate the Kubernetes module with a fixed namespace and Helm release, and the module will attempt to authenticate you using local credentials.
The change in the configuration was made with backwards compatibility in mind.
This update also renames the guard to be more descriptive.
This update also adds the Kubernetes service to the public API.

Example:

```app.module.ts
KubernetesModule.register({
    helmRelease: "comet-test",
    namespace: "comet-test",
}),
```
