---
title: API Generator
sidebar_position: 1
id: apigenerator
---

The API Generator can be used to generate the usual CRUD operations in GraphQL for an entity.

## Usage

### Annotate Entity

The API Generator uses the entity and the fields defined within it to generate resolvers, services, inputs, and other DTOs for the feature. For this, the entity must be annotated with the `CrudGenerator` decorator:

```ts
@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
export class Product extends BaseEntity<Product, "id"> implements DocumentInterface {
    ...
}
```

The option `targetDirectory` specifies the path where the generated files should be written.

:::info
For features that should exist only once per scope (e.g., a footer), there is the special CrudSingleGenerator decorator. The usage of both decorators is the same.
:::

### Annotate Field

By default, all fields of the entity are used for search, filtering, sorting, and input. If you want to change this for a specific field (e.g., making `description` not filterable), you can adjust it with the CrudField decorator.

```ts
@CrudField({
    search: true,
    filter: false,
    sort: true,
    input: true,
})
description: string;
```

### Generating Code

After the entity has been successfully annotated, you can run the API Generator. To do this, first add a new script to the scripts section of the api/package.json:

```json
{
    ...
    "scripts": {
        "api-generator": "rimraf 'src/*/generated' && comet-api-generator generate",
        ...
    }
}
```

Now you can run the generator with npm run api-generator. The generated files are located in the specified targetDirectory.

:::info
Although this is generated code, it should still be checked into the repository. This enables a quick start of the API
:::

### Register Resolver and Services

The resolvers and services created by the API Generator must be registered in the corresponding module:

```ts
import { ProductCrudResolver } from "./generated/product.crud.resolver";
import { ProductsService } from "./generated/products.service";
@Module({
    ...
    providers: [ProductCrudResolver, ProductsService],
})
export class ProductsModule {}
```

Done! The CRUD operations now appear in the GraphQL schema and can be used.

### Changing the Entity

When making changes (e.g. adding a new field) to an entity annotated with the CrudGenerator, the API Generator must be run again: `npm run api-generator`. The resulting changes must be checked into the repository.

:::info
In the CI/CD pipeline, it is checked whether the checked-in code matches the generated code. See the `lint:generated-files-not-modified` script in `api/package.json`.
:::

### Scaffolding

If the API Generator is used for scaffolding (e.g. because you need something, which the API Generator does not support), the `Crud\*` decorators should be removed after generation and the comments at sthe start of each generated file should be adapted. Additionaly, the generated code should be moved outside the `generated/` folder.
