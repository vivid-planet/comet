---
title: Full Text Search
---

# Full Text Search

:::caution Experimental
The Full Text Search module is experimental. Its API may change in future releases.
:::

## Introduction

The `FullTextSearchModule` provides a simple, PostgreSQL-native full text search for COMET DXP applications. It uses PostgreSQL's built-in `tsvector` type and full text index — no external search engine required.

**This module is not a replacement for Elasticsearch-based search.** It is intentionally simple and suitable for moderate content sizes. Consider it when:

- You need a **global search bar in the admin header** to find any content item across entity types.
- You are building an **MCP server** that needs to locate content by keyword.
- You need **site search** and the content volume is small enough that Elasticsearch would be overkill.

For large catalogs, complex relevance tuning, faceted filtering, or multilingual stemming, use a dedicated search engine instead.

## Usage

### API

#### 1. Add the module

Import `FullTextSearchModule` in your root `AppModule`:

```typescript title="app.module.ts"
import { FullTextSearchModule } from "@comet/cms-api";

@Module({
    imports: [
        // ...
        FullTextSearchModule,
    ],
})
export class AppModule {}
```

#### 2. Add a full text column to an entity

Each entity you want to make searchable needs:

1. A `tsvector` column to store the index (maintained automatically by MikroORM's `onCreate`/`onUpdate` hooks).
2. The `@EntityInfo` decorator to register the entity with the module.

```typescript title="news.entity.ts"
import { EntityInfo, entityToMikroOrmFullText } from "@comet/cms-api";
import { FullTextType, Index, Property } from "@mikro-orm/postgresql";

@EntityInfo<News>({
    name: "title",                          // field shown as the result title
    secondaryInformation: "slug",           // optional subtitle shown below the title
    visible: { status: { $eq: NewsStatus.active } }, // optional filter: only index visible items
    fullText: "fullText",                   // name of the tsvector column below
})
@Entity()
export class News extends BaseEntity {
    // ... other fields ...

    @Index({ type: "fulltext" })
    @Property<News>({
        nullable: true,
        type: new FullTextType(),
        onCreate: (news) => entityToMikroOrmFullText({ A: news.title, D: news.slug }, news.content),
        onUpdate: (news) => entityToMikroOrmFullText({ A: news.title, D: news.slug }, news.content),
    })
    fullText?: string;
}
```

The `entityToMikroOrmFullText` helper builds the weighted `tsvector` value. It accepts:

- A `WeightedFullTextValue` object mapping PostgreSQL weight letters (`A`–`D`) to plain-text strings. Weight `A` is the most relevant, `D` the least.
- Zero or more block data objects (see below).

#### 3. Enable full text search on the page tree (optional)

If your application uses `PageTreeModule`, pass `fullText: true` to its configuration to include page tree nodes and their documents in search results:

```typescript title="app.module.ts"
PageTreeModule.forRoot({
    // ...
    fullText: true,
}),
```

#### 4. Grant the permission

The `myFullTextSearch` GraphQL query requires the `fullTextSearch` permission. Add it to the appropriate roles in your user permissions configuration.

#### 5. The GraphQL query

Once the module is set up, the following query is available:

```graphql
query MySearch($search: String!, $scope: JSONObject) {
    myFullTextSearch(search: $search, scope: $scope, limit: 10) {
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

The optional `scope` parameter restricts results to a specific content scope.

### How to index blocks

Block content is indexed by extracting all text from the block tree and weighting it by heading level:

| HTML heading | PostgreSQL weight |
| ------------ | ----------------- |
| `h1`         | A (highest)       |
| `h2`         | B                 |
| `h3`         | C                 |
| `h4`–`h6`, other text | D (lowest) |

Pass block data directly to `entityToMikroOrmFullText` as additional arguments after the weighted fields object:

```typescript
entityToMikroOrmFullText(
    { A: news.title, D: news.slug }, // plain text fields with explicit weights
    news.content,                    // block data — text extracted and weighted automatically
    news.teaser,                     // additional blocks can be added
)
```

### Admin

#### Search bar in the admin header

`@comet/cms-admin` exports a ready-to-use `SearchHeaderItem` component. Add it to your application's `Header`:

```tsx title="MasterHeader.tsx"
import { BuildEntry, ContentScopeControls, Header, SearchHeaderItem, UserHeaderItem } from "@comet/cms-admin";

const MasterHeader = () => {
    return (
        <Header>
            <SearchHeaderItem />
            <ContentScopeControls />
            <BuildEntry />
            <UserHeaderItem />
        </Header>
    );
};
```

The component:

- Renders a search input in the header bar.
- Queries `myFullTextSearch` with a 250 ms debounce.
- Displays a dropdown with up to 10 results, showing the `name` and `secondaryInformation` for each item.
- Navigates to the matching entity's edit page when a result is clicked, using the application's dependency map.
- Is automatically hidden when the current user does not have the `fullTextSearch` permission.
