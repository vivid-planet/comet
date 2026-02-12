---
title: Access Control in the API
---

:::tip
For a comprehensive guide on how the permission system works internally, including detailed examples and best practices, see the [Implementation Guide](/docs/core-concepts/user-permissions/implementation-guide).
:::

:::note

The term **operation** stands for the locations in which COMET DXP invokes permission checks:

- Queries/Mutations in GraphQL-resolvers
- Routes in REST-controllers

Normally you want to decorate the methods of these classes, however, decorating the whole class is also possible.
:::

After activating the module, COMET DXP checks every operation for the required permissions and scopes. Therefore it is necessary to decorate the operations to let the system know what to check. COMET DXP then checks if the current user possesses the permission defined in the decorator.

Additionally, the scope of the data in operation will be checked against the scope of the users. To achieve this, the system has to know the scope of the data that is being handled right now.

:::note
You might also want to check the permissions on field resolvers. To do that, you have to add `guards` to `fieldResolverEnhancers` in the configuration of the GraphQL-module. Please be aware that field resolvers are only checked for permissions but not for scopes.
:::

## Permission check

**@RequiredPermission**

This decorator is mandatory for all operations. The first parameter of type `string | string[] | "disablePermissionCheck"` configures which permission is necessary to access the decorated operation.

The core of COMET DXP already defines a list of permissions (e.g. `pageTree`, `dam`, `cronJobs`, `userPermissions`). Permissions are defined as plain strings, in the most basic case they represent the main items of the menu bar in the admin panel.

However, if you need a more fine-grained access control you might want to concatenate strings, e.g. `newsRead` or `newsCreate`. Only create as many permissions as really necessary.

:::info
Future version will support a dot-like notation (e.g. `news` will subsume `news.read` and `news.write`).
:::

## Scope check

The scope check needs to know which scope is used for the current operation. This is described in [Evaluate Content Scopes documentation](/docs/core-concepts/content-scope/evaluate-content-scopes).

:::caution
COMET DXP validates the data relevant for the operation, but cannot check if the validated data is finally used. You are responsible for applying the validated data in your operations.
:::

## Disable permission/scope checks

**skipScopeCheck**

The scope check can be disabled by adding `{skipScopeCheck: true}` as the second argument of the `@RequiredPermission` decorator.

:::caution
Use this option only when you are sure that checking the scope is not necessary (e.g. the current entity does not have a scope). Do not add it just because it seems cumbersome at the moment to add the correct `AffectedEntity`/`ScopedEntity` decorators.
:::

:::note
Also, try to avoid using the `@GetCurrentUser` decorator (which often leads to use `skipScopeCheck`). Instead, you should explicitly send all the data needed in an operation. In the following example, this requires adding `userId` as a scope part as well as passing the data throughout the client. In general, this leads to a cleaner API design.

```diff
- @RequiredPermission("products", {skipScopeCheck: true})
+ @RequiredPermission("products")
+ @AffectedEntity(User, { idArg: "userId" })
- async myProducts(@GetCurrentUser() currentUser: CurrentUser): Promise<Product[]> {
+ async productsForUser(@Args("userId", { type: () => ID }) userId: string): Promise<Product[]> {
      //...
  }
```

:::

### @DisableCometGuards

`@DisableCometGuards()` disables the global auth guards (`CometAuthGuard`, `UserPermissionsGuard`). This may be used if a different authentication method is desired (e.g., basic authentication) for a specific handler or class in combination with a custom guard.

e.g.:

```typescript
@DisableCometGuards()
@UseGuards(MyCustomGuard)
async handlerThatUsesACustomGuard(): {
    ...
}
```

## Common Patterns

### Pattern 1: Simple CRUD with Scope Checking

For basic CRUD operations with scoped entities:

```typescript
@Resolver(() => Article)
@RequiredPermission("news")
export class ArticleResolver {
    // Read - checks permission and scope
    @Query(() => Article)
    @AffectedEntity(Article)
    async article(@Args("id", { type: () => ID }) id: string): Promise<Article> {
        return await this.em.findOneOrFail(Article, id);
    }
    
    // Create - checks permission and scope from argument
    @Mutation(() => Article)
    async createArticle(
        @Args("scope") scope: ContentScope,
        @Args("input") input: ArticleInput
    ): Promise<Article> {
        const article = new Article();
        article.scope = scope; // Use the validated scope
        article.title = input.title;
        await this.em.persistAndFlush(article);
        return article;
    }
    
    // Update - checks permission and scope from existing entity
    @Mutation(() => Article)
    @AffectedEntity(Article)
    async updateArticle(
        @Args("id", { type: () => ID }) id: string,
        @Args("input") input: ArticleInput
    ): Promise<Article> {
        const article = await this.em.findOneOrFail(Article, id);
        article.title = input.title;
        await this.em.flush();
        return article;
    }
    
    // Delete - checks permission and scope
    @Mutation(() => Boolean)
    @AffectedEntity(Article)
    async deleteArticle(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        const article = await this.em.findOneOrFail(Article, id);
        await this.em.removeAndFlush(article);
        return true;
    }
}
```

### Pattern 2: Related Entities with @ScopedEntity

When an entity doesn't have a direct scope property:

```typescript
// Entity without direct scope
@Entity()
@ScopedEntity(async (comment: Comment) => {
    const article = await comment.article.load();
    return article.scope;
})
export class Comment {
    @PrimaryKey()
    id: string;
    
    @Property()
    text: string;
    
    @ManyToOne(() => Article)
    article: Article;
}

// Resolver
@Resolver(() => Comment)
@RequiredPermission("news")
export class CommentResolver {
    @Mutation(() => Comment)
    @AffectedEntity(Comment)
    async updateComment(
        @Args("id", { type: () => ID }) id: string,
        @Args("input") input: CommentInput
    ): Promise<Comment> {
        // System loads Comment, then loads related Article to get scope
        const comment = await this.em.findOneOrFail(Comment, id);
        comment.text = input.text;
        await this.em.flush();
        return comment;
    }
}
```

### Pattern 3: Multiple Affected Entities

When an operation affects multiple entities:

```typescript
@Mutation(() => ProductVariant)
@RequiredPermission("products")
@AffectedEntity(ProductVariant)
@AffectedEntity(Product, { idArg: "productId" })
async createVariant(
    @Args("productId", { type: () => ID }) productId: string,
    @Args("input") input: VariantInput
): Promise<ProductVariant> {
    // System checks scopes of both Product and new ProductVariant
    const product = await this.em.findOneOrFail(Product, productId);
    const variant = new ProductVariant();
    variant.product = product;
    variant.scope = product.scope; // Inherit scope from product
    await this.em.persistAndFlush(variant);
    return variant;
}
```

### Pattern 4: Using @AffectedScope

When scope can be derived from arguments without loading entities:

```typescript
@Mutation(() => Article)
@RequiredPermission("news")
@AffectedScope((args: CreateArticleArgs) => ({
    domain: args.domain,
    language: args.language
}))
async createArticle(
    @Args("domain") domain: string,
    @Args("language") language: string,
    @Args("input") input: ArticleInput
): Promise<Article> {
    const article = new Article();
    article.scope = { domain, language };
    article.title = input.title;
    await this.em.persistAndFlush(article);
    return article;
}
```

### Pattern 5: Operations Without Scope (Use Carefully)

For truly global operations or entities without scopes:

```typescript
@Resolver(() => GlobalSettings)
@RequiredPermission("settings")
export class SettingsResolver {
    // Global settings have no scope concept
    @Query(() => GlobalSettings)
    @RequiredPermission("settings", { skipScopeCheck: true })
    async globalSettings(): Promise<GlobalSettings> {
        return await this.em.findOneOrFail(GlobalSettings, "singleton");
    }
    
    @Mutation(() => GlobalSettings)
    @RequiredPermission("settings", { skipScopeCheck: true })
    async updateGlobalSettings(
        @Args("input") input: SettingsInput
    ): Promise<GlobalSettings> {
        const settings = await this.em.findOneOrFail(GlobalSettings, "singleton");
        settings.apply(input);
        await this.em.flush();
        return settings;
    }
}
```

## How Decorators Work Together

When you use multiple decorators, they work in harmony:

```typescript
@Resolver(() => Product)
@RequiredPermission("products")  // 1. Class-level permission (applied to all methods)
export class ProductResolver {
    @Mutation(() => Product)
    @RequiredPermission(["products", "inventory"])  // 2. Method-level (overrides class-level)
    @AffectedEntity(Product)  // 3. Tells system to load Product and check its scope
    @AffectedEntity(Category, { idArg: "categoryId" })  // 4. Also check Category scope
    async updateProduct(
        @Args("id", { type: () => ID }) id: string,
        @Args("categoryId", { type: () => ID }) categoryId: string,
        @Args("input") input: ProductInput
    ): Promise<Product> {
        // Permission check: User needs "products" OR "inventory"
        // Scope check: Both Product(id) scope AND Category(categoryId) scope must match
        
        const product = await this.em.findOneOrFail(Product, id);
        const category = await this.em.findOneOrFail(Category, categoryId);
        product.category = category;
        await this.em.flush();
        return product;
    }
}
```

The execution flow:
1. User makes a request
2. `UserPermissionsGuard` intercepts
3. Checks if user has `"products"` OR `"inventory"` permission
4. Loads `Product` with `id` and extracts its scope
5. Loads `Category` with `categoryId` and extracts its scope
6. Checks if user's content scopes match BOTH the Product scope AND the Category scope
7. If all checks pass, resolver executes

## See Also

For more detailed information:
- [Implementation Guide](/docs/core-concepts/user-permissions/implementation-guide) - Deep dive into how everything works
- [Setup Guide](/docs/core-concepts/user-permissions/setup) - Initial configuration
- [Permissions in Admin](/docs/core-concepts/user-permissions/admin) - Frontend integration
