---
title: Deployment
---

There are several ways to deploy a Comet application. The best deployment method depends on your budget and requirements.

## Kubernetes

As stated in the [Overview](../overview/index.md), Comet DXP is a cloud-native CMS. Kubernetes is the preferred way to deploy a Comet application, as it provides the most flexibility and supports all enterprise requirements. However, this is usually the most expensive way of deploying a Comet application.

We provide [Helm](https://helm.sh/) Charts, which are available on [GitHub](https://github.com/vivid-planet/comet-charts), for easy deployment.

## Serverless

Comet Applications can also be deployed to serverless container platforms like [Azure Container Apps](https://azure.microsoft.com/en-us/products/container-apps) or [Digital Ocean App Platform](https://docs.digitalocean.com/products/app-platform/).

It's important to note that deploying to a serverless platform comes with its own set of limitations. For instance, you won't be able to use [CronJobModule](../cron-jobs/index.md) and the KubernetesModule in this setup.

## Docker Compose

For those with budget constraints, Docker Compose can be a viable option for deploying Comet applications.
