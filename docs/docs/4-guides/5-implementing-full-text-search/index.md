---
title: Implementing full-text search
---

This guide explains how to implement full-text search in a Comet application using the search views provided by `@comet/cms-api`.

Comet builds two PostgreSQL views from your entities at startup:

- **`EntityInfo`** – a unified view that exposes a `name`, `secondaryInformation` and `visible` flag for every entity that has an `@EntityInfo()` decorator (see [Dependencies](/docs/core-concepts/dependencies/)).
- **`EntityInfoFullText`** – a companion view that adds a searchable [`tsvector`](https://www.postgresql.org/docs/current/datatype-textsearch.html) column (`fullText`), the entity's scopes and its required permissions. It joins back to `EntityInfo` to reuse the name and secondary information.

Because both views are derived from your existing entities, you get cross-entity search (e.g. searching pages, news and products in a single query) without maintaining a separate search index.

:::info
This approach relies on PostgreSQL full-text search. It is suitable for basic search needs. If you have advanced requirements (typo tolerance, faceting, relevance tuning, large data sets), consider a dedicated search engine such as Elasticsearch instead.
:::

## How it works

Both views are created dynamically when the API boots — they are **not** part of your migrations. `FullTextSearchService` scans all entities for an `@EntityInfo()` decorator that declares a `fullText` field and builds a `UNION ALL` over them, so the `EntityInfoFullText` view always reflects the current set of searchable entities.

Each row in `EntityInfoFullText` carries:

| Column               | Purpose                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `id` / `entityName`  | Identify the source row (and join to `EntityInfo`)                                              |
| `fullText`           | The `tsvector` to match against using PostgreSQL full-text search                               |
| `requiredPermission` | The permissions required to see the entity (used by the permission-aware search)                |
| `scopes`             | The [content scopes](/docs/core-concepts/content-scope/) the entity belongs to                  |
| `entityInfo`         | Read-only relation to the matching `EntityInfo` row (`name`, `secondaryInformation`, `visible`) |

## Step 1: Make an entity searchable

To include an entity in the search views, add a full-text `tsvector` property to the entity and reference it from the `@EntityInfo()` decorator.

### Add a `fullText` property

Add a property of type `FullTextType` with a full-text index. Use `onCreate`/`onUpdate` to build the vector from the relevant fields. The keys `A`–`D` are PostgreSQL [weight labels](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING) — `A` ranks highest, so put the most important field (e.g. the title) there.

```ts title="news.entity.ts"
import { entityToMikroOrmFullText } from "@comet/cms-api";
import { FullTextType, Index, Property } from "@mikro-orm/postgresql";

@Index({ type: "fulltext" })
@Property<News>({
    nullable: true,
    type: new FullTextType(),
    onCreate: (news) => entityToMikroOrmFullText({ A: news.title, D: news.slug }, news.content),
    onUpdate: (news) => entityToMikroOrmFullText({ A: news.title, D: news.slug }, news.content),
})
fullText?: string;
```

`entityToMikroOrmFullText()` is a helper that merges plain field values with the searchable text extracted from one or more [blocks](/docs/core-concepts/blocks/) (here `news.content`). If your entity has no block content, you can return the weighted object directly:

```ts
onCreate: (product) => ({ A: product.title, D: product.description }),
```

:::note
The `fullText` column is recomputed on every create/update via the `onCreate`/`onUpdate` hooks, so existing rows are reindexed automatically the next time they are saved. After adding the property to entities that already have data, re-save them (or run a one-off script) to populate the column.
:::

### Reference `fullText` from `@EntityInfo()`

Add the `fullText` key to the entity's `@EntityInfo()` decorator. This tells `FullTextSearchService` to include the entity in the `EntityInfoFullText` view. The `name`, `secondaryInformation` and `visible` fields are reused from the regular `EntityInfo` configuration.

```ts title="news.entity.ts"
@EntityInfo<News>({
    name: "title",
    secondaryInformation: "slug",
    visible: { status: { $eq: NewsStatus.active } },
    fullText: "fullText",
})
@Entity()
export class News extends BaseEntity {
    // ...
}
```

That's all that is required on the entity side. Page tree documents (`Page`, `Link`, …) are indexed automatically through the page tree's own full-text view — they don't need an `@EntityInfo()` decorator.

## Step 2: Use the built-in admin search

`FullTextSearchModule` ships a ready-to-use, permission-aware query for the admin. Register the module in your API's `AppModule`:

```ts title="app.module.ts"
import { FullTextSearchModule } from "@comet/cms-api";

@Module({
    imports: [
        // ...
        FullTextSearchModule,
    ],
})
export class AppModule {}
```

This exposes a `myFullTextSearch` query that only returns entities the **current user** is allowed to see (it matches the row's `requiredPermission` against the user's permissions) and, by default, only visible entities:

```graphql
query Search($search: String!, $scope: JSONObject) {
    myFullTextSearch(search: $search, scope: $scope) {
        nodes {
            id
            entityName
            name
            secondaryInformation
        }
        totalCount
    }
}
```

Use this query whenever the search runs in an authenticated admin context.

## Step 3: Build a custom search resolver

The built-in `myFullTextSearch` is scoped to the authenticated admin user, so it is not suitable for a **public** site search where there is no logged-in user. For that, build a custom resolver that queries the same views directly.

`@comet/cms-api` exports the building blocks for this:

- `EntityInfoFullTextObject` – the MikroORM entity mapped to the `EntityInfoFullText` view.
- `EntityInfoObject` – the `EntityInfo` view (the GraphQL `EntityInfo` type), reachable via the `entityInfo` relation.
- `PaginatedEntityInfo` – the paginated GraphQL response type (`nodes` + `totalCount`).

### The resolver

The resolver queries `EntityInfoFullTextObject` with a `$fulltext` filter, populates the `entityInfo` relation, and returns a `PaginatedEntityInfo`.

```ts title="site-full-text-search.resolver.ts"
import {
    ContentScope,
    DisablePermissionCheck,
    EntityInfoFullTextObject,
    EntityInfoObject,
    PaginatedEntityInfo,
    RequiredPermission,
} from "@comet/cms-api";
import { EntityManager, type FilterQuery } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

// Entities exposed to the public site search. Unlike the admin search, this query does not filter by the
// current user's permissions, so it must only ever expose entities whose content is meant to be publicly searchable.
const searchableEntityNames = ["PageTreeNode", "News"];

@Resolver(() => EntityInfoObject)
export class SiteFullTextSearchResolver {
    constructor(private readonly entityManager: EntityManager) {}

    @Query(() => PaginatedEntityInfo)
    @RequiredPermission(DisablePermissionCheck)
    async siteFullTextSearch(
        @Args("search") search: string,
        @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
        @Args("limit", { type: () => Int, defaultValue: 25 }) limit: number,
        @Args("scope", { type: () => GraphQLJSONObject, nullable: true }) scope?: ContentScope,
    ): Promise<PaginatedEntityInfo> {
        const where: FilterQuery<EntityInfoFullTextObject> = {
            fullText: { $fulltext: search },
            entityName: { $in: searchableEntityNames },
            entityInfo: { visible: true },
        };

        if (scope) {
            // The view exposes a `scopes` array, so match rows whose scopes contain the requested scope.
            // GraphQL sends the scope object with a null prototype, which breaks MikroORM's internal hasOwnProperty
            // calls. Spreading into a plain object fixes this. See https://github.com/mikro-orm/mikro-orm/issues/2846.
            where.scopes = { $contains: [{ ...scope }] };
        }

        const [matches, totalCount] = await this.entityManager.findAndCount(
            EntityInfoFullTextObject,
            where,
            {
                offset,
                limit,
                populate: ["entityInfo"],
            },
        );

        return new PaginatedEntityInfo(
            matches.map((match) => match.entityInfo),
            totalCount,
        );
    }
}
```

Register the resolver in its own module and import it in `AppModule`:

```ts title="site-full-text-search.module.ts"
import { Module } from "@nestjs/common";

import { SiteFullTextSearchResolver } from "./site-full-text-search.resolver";

@Module({
    providers: [SiteFullTextSearchResolver],
})
export class SiteFullTextSearchModule {}
```

### Security considerations

:::warning
The custom resolver above uses `@RequiredPermission(DisablePermissionCheck)`, which disables Comet's permission check so the query is reachable without an authenticated admin user. That makes **every** row matched by the filter publicly readable.

Because permissions are no longer enforced, you must constrain the result set yourself:

- **Allow-list the entities** that may be exposed (`searchableEntityNames`) instead of returning everything in the view. Never expose entities that contain non-public or draft content.
- **Filter by visibility** (`entityInfo: { visible: true }`) so unpublished entities are never returned.
- **Filter by scope** so a request only sees content from the requested domain/language.

This follows Comet's [admin/public separation](/docs/core-concepts/user-permissions/) principle: public, permission-independent access is opt-in and narrowly scoped, never an "expose everything" default. Site-to-API calls should go through the BFF rather than hitting the API directly.
:::

## Step 4: Consume the search on the site

The query returns `EntityInfo` rows (`name`, `secondaryInformation`, …) but no target URL — the `EntityInfo` view intentionally doesn't know how to route to an entity. Derive the link on the client from `entityName` and the routing key carried in `secondaryInformation` (the page-tree path for pages, the slug for news):

```tsx
function getSearchResultPath(result: SearchResult): string | undefined {
    if (!result.secondaryInformation) {
        return undefined;
    }

    switch (result.entityName) {
        case "PageTreeNode":
            return `/${result.secondaryInformation}`;
        case "News":
            return `/news/${result.secondaryInformation}`;
        default:
            return undefined;
    }
}
```

Pass the current scope (`domain`, `language`) as the `scope` variable so results are limited to the site the visitor is browsing, and debounce the input to avoid a request on every keystroke.

A complete site implementation (a `FullTextSearchBlock` with a debounced search input and result list) is available in the Comet demo under `demo/site/src/common/blocks/FullTextSearchBlock.tsx`.
