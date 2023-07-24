---
title: Microservices
sidebar_position: 1
id: Microservices
---

A typical COMET DXP Application has an API, an Admin, and optionally multiple sites.

### API

Built with Typescript based on [NestJS](https://nestjs.com/). NestJS is an aggregator for a lot of well-known libraries. NestJS applications are structured in modules and rely heavily on [Dependency Injection](https://inversify.io/) (DI).

Interaction with the API is possible using [GraphQL](https://graphql.org/) except for uploading files where REST is used. We use [ApolloServer](https://www.apollographql.com/) for creating our GraphQL API. The GraphQL schema is generated using a code-first approach, where the schema is defined programmatically.

We persist our data in [PostgreSQL](https://www.postgresql.org/) database. As a connector from our API to the database, we use [MikroORM](https://mikro-orm.io/).

### Admin

The admin provides interfaces for managing data. It is built using [React](https://reactjs.org/) with Typescript. We create our admin applications using [MUI](https://mui.com/) design library. For interaction with the API we rely on [ApolloClient](https://www.apollographql.com/docs/react/), the counterpart to ApolloServer.

Other core libraries in use:

-   [FinalForm](https://final-form.org/react) for creating Forms
-   [ReactRouter](https://reactrouter.com/) for navigation

### Site

Consumer for the data. This part is optional because we are headless. Also, multiple sites for different clients (e.g., website and mobile app) can coexist.

While any technology can be used, we focus on [NextJS](https://nextjs.org/). With NextJS we can use Typescript and React for building our sites. NextJS provides Server Side Rendering (SSR), Client Side Rendering (CSR), and [Static Generation](https://nextjs.org/docs/basic-features/pages#pre-rendering) (SG). We focus on SG to optimize for speed while avoiding maintaining a cache.
