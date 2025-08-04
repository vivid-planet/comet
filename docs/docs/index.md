---
title: Overview
sidebar_position: 0
id: Overview
---

COMET DXP is a highly customizable platform for building modern applications based on a headless CMS.

The following design principles are considered:

- [The Twelve-Factor App](https://12factor.net/)
- Cloud-Native ([foundation/charter.md at main · cncf/foundation](https://github.com/cncf/foundation/blob/main/charter.md#1-mission-of-the-cloud-native-computing-foundation))
- Microservices ([What are microservices?](https://microservices.io/))
- Headless ([Headless content management system](https://en.wikipedia.org/wiki/Headless_content_management_system))
- Infrastructure as Code ([What is Infrastructure as Code (IaC)?](https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac))
- Mobile first
- Typescript everywhere

The following diagram visually highlights these principles.

![Architecture](./1-getting-started/images/application-baseline.jpg)

A typical COMET DXP application consists of multiple microservices which are shown in the following diagram.

![Architecture](./1-getting-started/images/architecture.jpg)

:::note

Many of the highlighted microservices can be exchanged or omitted.

:::

## Microservices

Some microservices are used as existing solutions and only need to be configured. Others are custom-built for the application.

### Existing Microservices

The following microservices are existing solutions that are used as-is and only need to be configured.

#### Database

We persist our data in [PostgreSQL](https://www.postgresql.org/) database.

#### Asset Storage

DAM assets and resized images are stored in a storage backend.

#### oauth2-proxy and Identity Provider (IDP)

The [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) is a reverse proxy that authenticates requests using an OIDC-compliant Identity Provider.

#### imgproxy

[imgproxy](https://imgproxy.net/) is a fast and efficient image proxy service that can be used to optimize and resize images. It is used to optimize images for the DAM.

### Custom Microservices

The following microservices are custom-built for the application.

#### API

Built with Typescript based on [NestJS](https://nestjs.com/). NestJS is an aggregator for a lot of well-known libraries. NestJS applications are structured in modules and rely heavily on [Dependency Injection](https://inversify.io/) (DI).

Interaction with the API is possible using [GraphQL](https://graphql.org/) except for uploading files where REST is used. We use [ApolloServer](https://www.apollographql.com/) for creating our GraphQL API. The GraphQL schema is generated using a code-first approach, where the schema is defined programmatically.

As a connector from our API to the database, we use [MikroORM](https://mikro-orm.io/).

#### Admin

The admin provides interfaces for managing data. It is built using [React](https://reactjs.org/) with Typescript. We create our admin applications using [MUI](https://mui.com/) design library. For interaction with the API we rely on [ApolloClient](https://www.apollographql.com/docs/react/), the counterpart to ApolloServer.

Other core libraries in use:

- [FinalForm](https://final-form.org/react) for creating Forms
- [ReactRouter](https://reactrouter.com/) for navigation

#### Site

Consumer for the data. This part is optional because we are headless. Also, multiple sites for different clients (e.g., website and mobile app) can coexist.

While any technology can be used, we focus on [NextJS](https://nextjs.org/). With NextJS we can use Typescript and React for building our sites. NextJS provides Server Side Rendering (SSR), Client Side Rendering (CSR), and [Static Generation](https://nextjs.org/docs/basic-features/pages#pre-rendering) (SG).

## Why not just use an off-the-shelf solution?

- We want a solution that is highly customizable
- We want to offer excellent developer experience (DX)
- We want to host on-premise

You can build two types of applications with COMET DXP:

- **Content websites**: Websites that are primarily content-driven without a lot of structured data. Content websites heavily use the CMS features (page tree, blocks etc.) and have at least one site.
- **Data-driven applications**: Applications that are primarily data-driven. Data-driven applications might not use the CMS features and might not have a site at all.

:::note
This terms are used throughout the documentation as some concepts heavily differ between this two types.
:::
