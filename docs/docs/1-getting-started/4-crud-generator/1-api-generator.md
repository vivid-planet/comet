---
title: API Generator
sidebar_position: 1
id: api-generator
---

The API Generator can be used to generate the usual CRUD operations in GraphQL for an entity.

## Annotate entity

The API Generator uses the entity and the fields defined within it to generate resolvers, services, inputs, and other
DTOs for the feature. For this, the entity must be annotated with the `CrudGenerator` decorator:

```ts
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Product extends BaseEntity {
    ...
}
```

The option `targetDirectory` specifies the path where the generated files should be written.

:::info
For features that should exist only once per scope (e.g., a footer), there is the special `CrudSingleGenerator`
decorator. The usage of both decorators is the same.
:::

### `@CrudGenerator()` options

| Parameter            | Type                 | Default     | Description                                                  |
| -------------------- | -------------------- | ----------- | ------------------------------------------------------------ |
| `targetDirectory`    | `string`             | Required    | The directory where the CRUD operations are generated.       |
| `requiredPermission` | `string[] \| string` | `undefined` | Permission(s) required to access the CRUD operations.        |
| `create`             | `boolean`            | `true`      | If `true`, includes the "create" operation.                  |
| `update`             | `boolean`            | `true`      | If `true`, includes the "update" operation.                  |
| `delete`             | `boolean`            | `true`      | If `true`, includes the "delete" operation.                  |
| `list`               | `boolean`            | `true`      | If `true`, includes the "list" operation.                    |
| `position`           | `object`             | `undefined` | Configures the optional [magic `position` field](#position). |

## Annotate field

By default, all entities' fields are used for search, filtering, sorting, and input. If you want to change this for a
specific field (e.g., making `description` not filterable), you can adjust it with the `@CrudField` decorator.

```ts
@CrudField({
    search: true,
    filter: false,
    sort: true,
    input: true,
})
description: string;
```

### `@CrudField()` options

| Parameter              | Type      | Default | Description                                                                                                                                        |
| ---------------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search`               | `boolean` | `true`  | Specifies if the field should be searchable.                                                                                                       |
| `filter`               | `boolean` | `true`  | Specifies if the field should be filterable.                                                                                                       |
| `sort`                 | `boolean` | `true`  | Specifies if the field should be sortable.                                                                                                         |
| `input`                | `boolean` | `true`  | Specifies if the field should be included in input types (e.g., for create/update).                                                                |
| `resolveField`         | `boolean` | `true`  | Relevant for relations. Indicates if a field resolver for the relation should be added to the resolver.                                            |
| `dedicatedResolverArg` | `boolean` | `false` | Relevant for relations. Adds a dedicated resolver argument for the relation to the create mutation. Otherwise it's included in the `input` object. |

## Generating code

After the entity has been successfully annotated, you can run the API Generator. Newer projects should already have an
`api-generator` npm script.
If it's still missing, you can add it to `api/package.json`:

```json
{
  ...
  "scripts": {
    "api-generator": "rimraf --glob 'src/**/generated' && comet-api-generator generate",
    ...
  }
}
```

Now you can run the generator with `npm run api-generator`. The generated files are located in the specified
`targetDirectory`.

:::info
Although this is generated code, it should still be checked into the repository. This enables a quick start of the API.
:::

### Watch Mode

The api-generator script also supports the `-w` or `--watch` flag. This will watch for changes in the .entity.ts files and regenerate the corresponding files.

```json
{
  ...
  "scripts": {
    "api-generator:watch": "rimraf 'src/*/generated' && comet-api-generator --watch",
    ...
  }
}
```

### Generate only for specific entities

If you want to generate only for specific entities, you can pass a file path to an .entity.ts file with the `-f` or `--file` flag

```sh
npm exec comet-api-generator -f src/products/entities/product.entity.ts
```

## Register generated resolvers and services

The resolvers and services created by the API Generator must be registered in the corresponding module:

```ts
import { ProductsService } from "./generated/products.service";
import { ProductResolver } from "./generated/product.resolver";

@Module({
    // ...
    providers: [ProductResolver, ProductsService],
})
export class ProductsModule {}
```

:::info
Depending on the magic fields of the entity (e.g., `position`), the service might not be generated.
:::

Done! The CRUD operations now appear in the GraphQL schema and can be used.

:::warning
**The generated code must be viewed as a self-contained unit and can change incompatibly even between minor versions.**

You should not reference the generated code externally (except, of course, to provide the resolver in the module).
:::

## Changing the entity

When making changes (e.g., adding a new field) to an entity annotated with the CrudGenerator, the API Generator must be
run again: `npm run api-generator`.

## Magic fields

The API generator supports the following magic fields:

### position

Adding a `position` field enables item ordering. The generated code ensures unique positions and updates them during
create, update, or delete actions.

```ts
@Field(() => Int)
@Property({ columnType: "integer" })
@Min(1)
position: number;
```

#### Grouping by a specific field

Using the `position.groupByFields` option in the [`@CrudGenerator` decorator](#crudgenerator-options), you can group the entries by a specific field, or a combination of fields, ensuring the `position` starts over at 1 for each distinct value of the grouped field(s).

For example, if your entity is listed separately for each value of its `country` field, you can group the positions by country:

```ts
@CrudGenerator({
    // ...
    position: { groupByFields: ["country"] },
})
```

### status

A `status` field lets you filter items by status in the list query.

### scope

The API generator treats a `scope` as a [COMET content scope](/docs/core-concepts/content-scope/). A `scope` arg is added to the list
and create operations, ensuring the [scope check](/docs/core-concepts/user-permissions/access-control/#scope-check) can be made.

If no `scope` field is present, the scope check is skipped for all operations.

### slug

Adding a `slug` field generates a `entityBySlug` operation in the API.

## Customizing

:::warning
Don't make any changes in the generated files! They will be overwritten during the next run of the API Generator.
:::

If the generated code does not meet your requirements, there are two ways to add custom functionality:

1. Extending the generated code without changing it (recommended)
2. Scaffolding (if the generated code is not suitable at all)

**Always try to extend the generated code instead of scaffolding if possible.**

### Extending

#### Resolver

You can't add custom code to the generated resolver directly. Instead, the recommended way is to create a second,
non-generated resolver for specific functionality:

```ts
// products/generated/product.resolver.ts
// Generated; don't touch this!
@Resolver(() => Product)
export class ProductResolver {
    // ...
}
```

```ts
// products/custom-product.resolver.ts
// custom resolver
@Resolver(() => Product)
export class CustomProductResolver {
    // ...
}
```

GraphQL will automatically "merge" the resolvers if the returned entities in `@Resolver(() => Entity)` is identical.

While it is generally discouraged to extend the generated resolvers, it is possible to do so. This can be useful if you need to modify small parts of the resolver or your custom code needs to reuse code from the generated resolver.

```ts
@Resolver(() => Product)
export class CustomProductResolver extends ProductResolver {
    // ...
}
```

:::warning
Only add the CustomProductResolver to the module if you extend the generated resolver.
:::

#### Service

You can't add custom code to the generated service directly. Instead, the recommended way is to create a second,
non-generated service for specific functionality:

```ts
// products/generated/products.service.ts
// Generated; don't touch this!
@Injectable()
export class ProductsService {
    constructor(
        private readonly entityManager: EntityManager,
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
    ) {}

    // ...
}
```

```ts
// products/custom-products.service.ts
// custom service
@Injectable()
export class CustomProductsService {
    constructor(private readonly productsService: ProductsService) {}

    calculateVAT(product: Product): number {
        return Number(((Number(product.price) / 1.2) * 0.2).toFixed(2));
    }
}
```

The custom service can also be extended using inheritance in the same way as the resolver.

### Scaffolding

If the generated code doesn't fit your needs at all, you can "scaffold" the code. To do this, you must

1. Remove the `@Crud\*` decorators from the entity

```diff
  @ObjectType()
  @Entity()
  @RootBlockEntity<Product>({ isVisible: (product) => product.status === ProductStatus.Published })
- @CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
  export class Product extends BaseEntity<Product, "id"> {
      // ...
  }
```

2. Move the generated files outside the /generated folder

```
renamed:    demo/api/src/products/generated/dto/paginated-products.ts   -> demo/api/src/products/paginated-products.ts
renamed:    demo/api/src/products/generated/dto/product.filter.ts       -> demo/api/src/products/product.filter.ts
renamed:    demo/api/src/products/generated/dto/product.input.ts        -> demo/api/src/products/product.input.ts
renamed:    demo/api/src/products/generated/product.resolver.ts         -> demo/api/src/products/product.resolver.ts
renamed:    demo/api/src/products/generated/dto/product.sort.ts         -> demo/api/src/products/product.sort.ts
```

3. Remove the comments at the start of each generated file

```diff
- // This file has been generated by comet api-generator.
- // You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.

// ...
```

Now the code is completely under your control and can be adjusted as needed.

:::warning
**Scaffolding is all or nothing!**

If you decide to scaffold, you must remove all code from the /generated folder. It's not possible to "split" the code,
e.g. by scaffolding only the resolver and keeping the DTOs generated. This will likely lead to major issues during the
next major update (maybe even after minor updates).
:::

### FAQ: Extend or scaffold?

:::info
**Always try to extend the generated code instead of scaffolding if possible.**
:::

#### I want to add an additional field resolver for the entity

Don't scaffold.

Instead, create a second, custom resolver [as described above](#resolver).

#### I need custom logic only in my create mutation

Don't scaffold.

Instead, deactivate `create` in the `@CrudGenerator` decorator:

```ts
@CrudGenerator({
    targetDirectory: `${__dirname}/../generated/`,
    create: false,
})
export class Product extends BaseEntity<Product, "id"> {
    // ...
}
```

Then create a second, custom resolver and implement the create mutation there. This way, the other CRUD operations are
still managed by the generator.
