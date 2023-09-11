---
title: Deployment of Libraries & Canary Releases
sidebar_position: 12
---

All of our packages versions use [semantic versioning](https://semver.org/). To manage all of these on the side of our big monorepo, we use the tool "[lerna](https://github.com/lerna/lerna)."

## Canary Releases

Every pull request merged in one of our protected branches will automatically trigger a canary release (`1.0.1-canary.8.0`) and be published by CI.

## Stable versions

When we want to post a new stable major/minor/patch, you only have to push a new tag with the next version (`1.0.0`), and CI will do the rest for you. It publishes the version of the tag to the registry.

**Sample:**

    git tag 1.0.0
    git push --tags
