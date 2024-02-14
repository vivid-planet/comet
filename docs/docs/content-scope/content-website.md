---
title: Content website
sidebar_position: 1
---

In a content website, the content scope can be used to divide multiple areas of content, such as website (domain) or language. Each area stores it's content independent of the others. Not all modules might use the same scope, for example the DAM might not be scoped at all. In this use case the most scope features of COMET will work out-of-the-box.


### Api: Database

Usually scope is stored in a "scope" object as embeddable like so, api-generator will create a nice api where you have to pass scope.

```ts title="api/src/news/entities/news.entity.ts"
@Embeddable()
@ObjectType("")
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

### Api: Graphql Api

The graphql api will contain a scope argument (where it makes sense), as defined in the example above.

### Admin: Scope Selector
On the admin side you need a `<ContentScopeProvider>` and `<ContentScopeControls>` in the `MasterHeader` component.

Then you can use `useContentScope()` to access the currently selected scope - which you typically pass thru to api requests.

### Api: UserPermissions

UserPermissions will validate scope arguments of graphql queries/mutations and has access to the scope of an entity if it is stored as scope. You additionally need `@ScopedEntity` (at entitiy level) for nested entities and `@AffectedEntity` (at resolver level) for queries/mutations without scope argument.
