---
title: Implementation Guide
---

This guide explains how the permission system works internally and how the different components work together.

## Overview

The COMET DXP permission system is built around two main concepts:

1. **Permissions** - Control access to specific operations (queries, mutations, routes)
2. **Content Scopes** - Control access to specific data based on dimensions like domain and language

These two concepts work together through the `AccessControlService`, decorators, and guards to provide comprehensive access control.

## Architecture

### Core Components

#### 1. AccessControlService

The `AccessControlService` is the central component that determines what users can access. It must extend `AbstractAccessControlService` and can implement two key methods:

```typescript
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User, availablePermissions: Permission[]): PermissionsForUser {
        // Return the permissions this user should have
    }
    
    getContentScopesForUser(user: User): ContentScopesForUser {
        // Return the content scopes this user can access
    }
}
```

**getPermissionsForUser()**

This method assigns permissions to users. It receives:
- `user`: The user object (typically from your authentication system)
- `availablePermissions`: All permissions registered in the system

It should return either:
- An array of permission objects: `[{ permission: "products" }, { permission: "news" }]`
- `UserPermissions.allPermissions` for admin users with full access

You can also specify per-permission content scopes:
```typescript
return [
    { 
        permission: "products",
        contentScopes: [{ domain: "main", language: "en" }]
    },
    {
        permission: "news",
        // No contentScopes specified - will use getContentScopesForUser()
    }
];
```

Additional metadata can be included:
- `validFrom`, `validTo`: Time-based permissions
- `reason`, `requestedBy`, `approvedBy`: Audit information

**getContentScopesForUser()**

This method defines the default content scopes a user can access. It should return either:
- An array of content scope objects: `[{ domain: "main", language: "en" }, { domain: "secondary", language: "de" }]`
- `UserPermissions.allContentScopes` for admin users with full access

:::note
Content scopes defined in `getPermissionsForUser` for a specific permission will override the default scopes from `getContentScopesForUser` for that permission only.
:::

**isAllowed()**

The `AbstractAccessControlService` provides a default implementation of `isAllowed()` that:
1. Checks if the user has the required permission
2. If a content scope is provided, checks if any of the user's content scopes match the target scope

You can override this method for custom permission logic:
```typescript
isAllowed(user: CurrentUser, permission: Permission, contentScope?: ContentScope): boolean {
    // Custom permission logic
    return super.isAllowed(user, permission, contentScope);
}
```

#### 2. UserPermissionsGuard

The `UserPermissionsGuard` is automatically applied to all operations and:
1. Extracts the current user from the request
2. Reads metadata from decorators (`@RequiredPermission`, `@AffectedEntity`, etc.)
3. Determines the required content scopes using `ContentScopeService`
4. Calls `accessControlService.isAllowed()` to check permissions
5. Returns `true` to allow access or `false` to deny

The guard checks permissions and scopes together:
- For queries/mutations (not field resolvers): Both permission AND scope must match
- For field resolvers: Only permission is checked (scope checking is skipped)

#### 3. ContentScopeService

The `ContentScopeService` determines which content scopes are affected by an operation. It extracts scopes from:
1. **@AffectedEntity decorators** - Loads the entity and reads its scope
2. **@AffectedScope decorators** - Derives scope from arguments
3. **Scope arguments** - Direct scope parameters in the operation

## Decorators

### @RequiredPermission

This decorator is **mandatory** for all operations. It specifies which permission(s) are required.

**Basic usage:**
```typescript
@Resolver(() => Product)
@RequiredPermission("products")
export class ProductResolver {
    // All methods require "products" permission
}
```

**Multiple permissions (OR logic):**
```typescript
@RequiredPermission(["products", "inventory"])
async updateStock() {
    // User needs EITHER "products" OR "inventory" permission
}
```

**Skip scope check:**
```typescript
@RequiredPermission("products", { skipScopeCheck: true })
async listAllProducts() {
    // Only checks permission, not content scope
    // Use when the operation doesn't work with scoped data
}
```

:::caution
Only use `skipScopeCheck: true` when the entity truly has no scope. Don't use it as a shortcut to avoid implementing proper scope checking.
:::

### @AffectedEntity

This decorator tells the system which entity is being affected by an operation. The system will:
1. Load the entity from the database using the provided ID
2. Extract the content scope from the entity's `scope` property
3. If the entity doesn't have a `scope` property, use the `@ScopedEntity` decorator on the entity class

**Basic usage:**
```typescript
@Mutation(() => Product)
@RequiredPermission("products")
@AffectedEntity(Product)
async updateProduct(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: ProductInput
): Promise<Product> {
    // System loads Product with 'id' and checks its scope
}
```

**Custom ID argument:**
```typescript
@AffectedEntity(Product, { idArg: "productId" })
async updateProduct(
    @Args("productId", { type: () => ID }) productId: string,
    @Args("input") input: ProductInput
): Promise<Product> {
    // System uses 'productId' instead of default 'id'
}
```

**Multiple affected entities:**
```typescript
@Mutation(() => ProductVariant)
@RequiredPermission("products")
@AffectedEntity(ProductVariant)
@AffectedEntity(Product, { idArg: "productId" })
async createVariant(
    @Args("productId", { type: () => ID }) productId: string,
    @Args("input") input: VariantInput
): Promise<ProductVariant> {
    // Both Product and ProductVariant scopes are checked
}
```

**Nullable entities:**
```typescript
@AffectedEntity(Product, { nullable: true })
async getProduct(
    @Args("id", { type: () => ID, nullable: true }) id?: string
): Promise<Product | null> {
    // ID is optional, no error if not provided
}
```

**Page tree nodes:**
```typescript
@AffectedEntity(Product, { pageTreeNodeIdArg: "nodeId" })
async attachToNode(
    @Args("nodeId", { type: () => ID }) nodeId: string,
    @Args("productId", { type: () => ID }) productId: string
): Promise<boolean> {
    // System loads page tree node and uses its scope
}
```

### @ScopedEntity

This decorator is used on entity classes that don't have a direct `scope` property but need to derive their scope from related entities.

**Using a function:**
```typescript
@Entity()
@ScopedEntity(async (comment: Comment) => {
    // Load related entity and return its scope
    const article = await comment.article.load();
    return article.scope;
})
export class Comment {
    @ManyToOne(() => Article)
    article: Article;
}
```

**Using a service (recommended for complex logic):**
```typescript
@Injectable()
export class CommentScopeService implements EntityScopeServiceInterface<Comment> {
    constructor(private readonly em: EntityManager) {}
    
    async getEntityScope(comment: Comment): Promise<ContentScope> {
        const article = await this.em.findOneOrFail(Article, comment.articleId);
        return article.scope;
    }
}

@Entity()
@ScopedEntity(CommentScopeService)
export class Comment {
    @Property()
    articleId: string;
}
```

**Returning multiple scopes:**
```typescript
@ScopedEntity(async (tag: Tag) => {
    // A tag might be used across multiple products with different scopes
    const products = await tag.products.loadItems();
    return products.map(p => p.scope);
})
export class Tag {
    @ManyToMany(() => Product)
    products: Collection<Product>;
}
```

### @AffectedScope

This decorator allows you to derive a content scope directly from the operation's arguments without loading an entity.

```typescript
@Mutation(() => Product)
@RequiredPermission("products")
@AffectedScope((args: { domain: string; language: string }) => ({
    domain: args.domain,
    language: args.language
}))
async createProduct(
    @Args("domain") domain: string,
    @Args("language") language: string,
    @Args("input") input: ProductInput
): Promise<Product> {
    // Scope is derived from domain and language arguments
}
```

### Scope Arguments

You can also pass scope as a direct argument:

```typescript
@Mutation(() => Product)
@RequiredPermission("products")
async createProduct(
    @Args("scope") scope: ContentScope,
    @Args("input") input: ProductInput
): Promise<Product> {
    // System reads scope directly from arguments
}
```

## How Components Work Together

Let's walk through a complete example to see how all pieces fit together:

```typescript
// 1. Define your permission enum
export enum AppPermission {
    products = "products",
    news = "news",
}

// 2. Define your content scope
export interface ContentScope {
    domain: string;
    language: string;
}

// 3. Implement AccessControlService
@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User, availablePermissions: Permission[]): PermissionsForUser {
        if (user.isAdmin) {
            return UserPermissions.allPermissions;
        }
        
        // Regular users can't access user permissions management
        const deniedPermissions: Permission[] = ["userPermissions"];
        return availablePermissions
            .filter((permission) => !deniedPermissions.includes(permission))
            .map((permission) => ({ permission }));
    }
    
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.isAdmin) {
            return UserPermissions.allContentScopes;
        }
        
        // Regular users can only access main domain, English content
        return [{ domain: "main", language: "en" }];
    }
}

// 4. Create your entity with scope
@Entity()
export class Product {
    @PrimaryKey()
    id: string;
    
    @Property()
    name: string;
    
    @Property({ type: "json" })
    scope: ContentScope;
}

// 5. Create your resolver with decorators
@Resolver(() => Product)
@RequiredPermission("products")
export class ProductResolver {
    constructor(private readonly em: EntityManager) {}
    
    // Query - checks permission and scope
    @Query(() => Product)
    @AffectedEntity(Product)
    async product(
        @Args("id", { type: () => ID }) id: string
    ): Promise<Product> {
        return await this.em.findOneOrFail(Product, id);
    }
    
    // Mutation - checks permission and scope
    @Mutation(() => Product)
    async createProduct(
        @Args("scope") scope: ContentScope,
        @Args("input") input: ProductInput
    ): Promise<Product> {
        const product = new Product();
        product.name = input.name;
        product.scope = scope;
        await this.em.persistAndFlush(product);
        return product;
    }
    
    // Mutation - checks permission and scope of existing entity
    @Mutation(() => Product)
    @AffectedEntity(Product)
    async updateProduct(
        @Args("id", { type: () => ID }) id: string,
        @Args("input") input: ProductInput
    ): Promise<Product> {
        const product = await this.em.findOneOrFail(Product, id);
        product.name = input.name;
        await this.em.flush();
        return product;
    }
    
    // Mutation - scope check disabled (not recommended unless necessary)
    @Mutation(() => Boolean)
    @RequiredPermission("products", { skipScopeCheck: true })
    async deleteAllProducts(): Promise<boolean> {
        await this.em.nativeDelete(Product, {});
        return true;
    }
}
```

**What happens when a user calls `updateProduct`:**

1. User makes a GraphQL request with JWT token
2. Authentication middleware validates token and loads user
3. `UserPermissionsGuard` is triggered:
   - Reads `@RequiredPermission("products")` - user needs "products" permission
   - Reads `@AffectedEntity(Product)` - needs to check scope of Product with `id`
   - Calls `ContentScopeService.getScopesForPermissionCheck()`:
     - Loads `Product` from database using `id`
     - Extracts `scope` from the Product entity
   - Calls `AccessControlService.isAllowed(user, "products", productScope)`:
     - Calls `getPermissionsForUser(user)` to get user's permissions
     - Checks if user has "products" permission
     - Calls `getContentScopesForUser(user)` to get user's scopes
     - Checks if any user scope matches the product's scope
   - Returns `true` if both permission and scope match, `false` otherwise
4. If allowed, the resolver method executes
5. If denied, a 403 Forbidden error is returned

## Permission Sources: By Rule vs Manual

Permissions can be assigned in two ways:

### 1. Permission By Rule (Programmatic)

Permissions assigned through `getPermissionsForUser()` in the `AccessControlService`. These are:
- Defined in code
- Applied automatically based on user attributes
- Perfect for role-based access control
- Marked as `source: UserPermissionSource.BY_RULE` in the database

**Example:**
```typescript
getPermissionsForUser(user: User, availablePermissions: Permission[]): PermissionsForUser {
    // Admins get all permissions
    if (user.isAdmin) {
        return UserPermissions.allPermissions;
    }
    
    // Editors get specific permissions
    if (user.role === "editor") {
        return [
            { permission: "news" },
            { permission: "pageTree" },
        ];
    }
    
    // Viewers get read-only permissions
    return [
        { permission: "news", contentScopes: [{ domain: "main" }] }
    ];
}
```

### 2. Manual Permissions

Permissions assigned through the admin panel's User Permissions interface. These are:
- Stored in the `UserPermission` table
- Can be granted/revoked per user
- Can include time-based restrictions (`validFrom`, `validTo`)
- Can include audit information (`reason`, `requestedBy`, `approvedBy`)
- Can override content scopes per permission
- Marked as `source: UserPermissionSource.MANUAL` in the database

The admin panel allows administrators to:
- View all users
- See their current permissions (both by rule and manual)
- Add new manual permissions
- Remove manual permissions
- Set permission validity periods
- Add reason and approval information

### Combined Behavior

When checking permissions, the system considers **both** programmatic and manual permissions:
- A user's final permissions are the **union** of both sources
- Manual permissions can grant additional access beyond programmatic rules
- Manual permissions **cannot** remove permissions granted by rules

**Example:**
```typescript
// Programmatic: User has "news" permission
getPermissionsForUser(user) // returns [{ permission: "news" }]

// Manual: Admin grants "products" permission in admin panel
// Result: User has both "news" and "products" permissions
```

## Best Practices

### 1. Permission Granularity

Define permissions at the right level of granularity:
- ✅ Good: `"products"` for all product operations
- ❌ Too broad: `"admin"` for everything
- ❌ Too granular: `"productsRead"`, `"productsCreate"`, `"productsUpdate"`, `"productsDelete"`

Keep permissions aligned with menu structure and major feature areas.

### 2. Always Use Scope Checking

Unless the entity truly has no scope (like global settings), always check scopes:
```typescript
// ❌ Bad - unnecessarily skips scope check
@RequiredPermission("products", { skipScopeCheck: true })
async updateProduct(@Args("id") id: string) { ... }

// ✅ Good - properly checks scope
@RequiredPermission("products")
@AffectedEntity(Product)
async updateProduct(@Args("id") id: string) { ... }
```

### 3. Use @AffectedEntity for Updates/Deletes

Always use `@AffectedEntity` when modifying existing data:
```typescript
@Mutation(() => Product)
@RequiredPermission("products")
@AffectedEntity(Product)
async updateProduct(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: ProductInput
): Promise<Product> { ... }
```

### 4. Use Scope Arguments for Creates

For create operations, pass the scope as an argument:
```typescript
@Mutation(() => Product)
@RequiredPermission("products")
async createProduct(
    @Args("scope") scope: ContentScope,
    @Args("input") input: ProductInput
): Promise<Product> {
    const product = new Product();
    product.scope = scope; // Use the validated scope
    // ...
}
```

### 5. Implement @ScopedEntity for Related Entities

For entities without direct scopes, implement `@ScopedEntity`:
```typescript
@Entity()
@ScopedEntity(async (comment: Comment) => {
    const article = await comment.article.load();
    return article.scope;
})
export class Comment {
    @ManyToOne(() => Article)
    article: Article;
}
```

### 6. Consider Content Scope Overrides

For fine-grained control, override scopes per permission:
```typescript
getPermissionsForUser(user: User): PermissionsForUser {
    return [
        {
            permission: "products",
            contentScopes: [
                { domain: "main", language: "en" },
                { domain: "main", language: "de" }
            ]
        },
        {
            permission: "news",
            contentScopes: [
                { domain: "main", language: "en" }
            ]
        }
    ];
}
```

### 7. Use System Users for Background Tasks

For scheduled jobs and system operations, define system users:
```typescript
UserPermissionsModule.forRootAsync({
    useFactory: () => ({
        systemUsers: ["system", "cron-job"],
        // ...
    }),
}),
```

System users bypass permission checks when authenticated.

### 8. Test Permission Boundaries

Always test edge cases:
- Users with no permissions
- Users with one scope trying to access another scope
- Users with expired time-based permissions
- Multiple affected entities with different scopes

## Demo Application Examples

The demo application provides real-world examples of the permission system:

### Example 1: Product Management

```typescript
// demo/api/src/products/generated/product.resolver.ts
@Resolver(() => Product)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class ProductResolver {
    @Query(() => Product)
    @AffectedEntity(Product)
    async product(@Args("id", { type: () => ID }) id: string): Promise<Product> {
        return await this.entityManager.findOneOrFail(Product, id);
    }
    
    @Mutation(() => Product)
    @AffectedEntity(Product)
    async updateProduct(
        @Args("id", { type: () => ID }) id: string,
        @Args("input") input: ProductInput
    ): Promise<Product> {
        const product = await this.entityManager.findOneOrFail(Product, id);
        // ... update logic
        return product;
    }
}
```

### Example 2: Access Control Service Implementation

```typescript
// demo/api/src/auth/access-control.service.ts
@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    getPermissionsForUser(user: User, availablePermissions: Permission[]): PermissionsForUser {
        if (user.isAdmin) {
            return UserPermissions.allPermissions;
        } else {
            const deniedPermissions: Permission[] = ["userPermissions"];
            return availablePermissions
                .filter((permission) => !deniedPermissions.includes(permission))
                .map((permission) => ({ permission }));
        }
    }
    
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.isAdmin) {
            return UserPermissions.allContentScopes;
        } else {
            return [{ domain: "main", language: "en" }];
        }
    }
}
```

### Example 3: Multiple Affected Entities

```typescript
// demo/api/src/products/generated/product-variant.resolver.ts
@Mutation(() => ProductVariant)
@RequiredPermission("products", { skipScopeCheck: true })
@AffectedEntity(ProductVariant)
@AffectedEntity(Product, { idArg: "product" })
async updateProductVariant(
    @Args("product", { type: () => ID }) product: string,
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: ProductVariantInput
): Promise<ProductVariant> {
    // Both ProductVariant and Product scopes are validated
}
```

## Troubleshooting

### Error: "RequiredPermission decorator is missing"

**Cause:** An operation (query/mutation/route) doesn't have the `@RequiredPermission` decorator.

**Solution:** Add the decorator to all operations:
```typescript
@Query(() => Product)
@RequiredPermission("products")  // Add this
async product(@Args("id") id: string) { ... }
```

### Error: "Could not get content scope"

**Cause:** The system can't determine which content scope to check.

**Solution:** Add one of:
- `@AffectedEntity(Entity)` decorator
- `@AffectedScope()` decorator
- A `scope` argument to your operation
- Or use `{ skipScopeCheck: true }` if truly not needed

### Error: "Entity is missing @ScopedEntity decorator"

**Cause:** An entity referenced by `@AffectedEntity` doesn't have a `scope` property and doesn't have the `@ScopedEntity` decorator.

**Solution:** Add the decorator to your entity:
```typescript
@Entity()
@ScopedEntity(async (entity) => {
    // Derive scope from related entity
    const parent = await entity.parent.load();
    return parent.scope;
})
export class MyEntity { ... }
```

### Permission Check Passes but Should Fail

**Cause:** Often related to scope checking being skipped unintentionally.

**Solution:** 
1. Check if `skipScopeCheck: true` is used
2. Verify `@AffectedEntity` is present
3. Ensure entity has correct scope value
4. Check `getContentScopesForUser()` returns expected scopes

### User Can't Access Expected Resources

**Cause:** Scope mismatch between user and content.

**Solution:**
1. Check user's scopes via `getContentScopesForUser()`
2. Check content's scope in database
3. Verify scope dimensions match (e.g., both have `domain` and `language`)
4. Check for null vs undefined in scope dimensions (they're treated as equal)

## Related Documentation

- [User Permissions Overview](/docs/core-concepts/user-permissions)
- [Setup Guide](/docs/core-concepts/user-permissions/setup)
- [Access Control in the API](/docs/core-concepts/user-permissions/access-control)
- [Permissions in Admin](/docs/core-concepts/user-permissions/admin)
- [Content Scopes](/docs/core-concepts/content-scope)
