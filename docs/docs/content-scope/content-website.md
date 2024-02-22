---
title: Content website
sidebar_position: 1
---

In a content website, the content scope can be used to separate multiple areas of content, such as website (domain) or language. Each area stores its content independent of the others. Not all modules might use the same scope, for example, the DAM might not be scoped at all. Most of Comet's scope features will work out-of-the-box for this use case.


### API: Database

Usually the scope is stored in a "scope" object as an [embeddable](https://mikro-orm.io/docs/embeddables), which the API Generator will then use to create a standardized API that requires passing the scope.

```ts title="api/src/news/entities/news.entity.ts"
@Embeddable()
@ObjectType()
@InputType("NewsContentScopeInput")
export class NewsContentScope {
    @Property({ columnType: "text" })
    @Field()
    @IsString()
    domain: string;

    @Property({ columnType: "text" })
    @Field()
    @IsString()
    language: string;
}

@Entity()
export class News extends BaseEntity<News, "id"> {
    @Embedded(() => NewsContentScope)
    @Field(() => NewsContentScope)
    scope: NewsContentScope;
}
```

### API: GraphQL API

The GraphQL API will have a scope argument (where it makes sense), for the `News` example from above the API will have a `scope` argument:
```
newsList(scope: NewsContentScopeInput!, offset: Int! = 0, limit: Int! = 25, search: String, filter: NewsFilter, sort: [NewsSort!]): PaginatedNews!
```

### Admin: Scope Selector
In the Admin you need a `<ContentScopeProvider>` and `<ContentScopeControls>` in the `MasterHeader` component.

You can then use `useContentScope()` to access the currently selected scope, which you will then usually pass through to API requests.

### API: User permissions

User permissions will validate `scope` arguments of GraphQL operations and check if a user has access to the scope of an entity (the column name needs to be `scope`). You additionally need `@ScopedEntity` (at entity level) for nested entities and `@AffectedEntity` (at resolver level) for operations without a `scope` argument.
