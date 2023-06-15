---
"@comet/cms-api": patch
---

Change propagationPolicy for deleting jobs from default to Background

Currently we use the default propagationPolicy for deleting jobs. This results in pods from jobs being deleted in k8s but not on OpenShift. With the value fixed to "Background", the jobs should get deleted on every system.
Foreground would be blocking, so we use Background to be non blocking.
