---
name: comet-graphql-api
description: Generate or update a full GraphQL CRUD API for a MikroORM entity in the Comet DXP stack. Produces a resolver, DTOs (input, filter, sort, args, paginated response), optional positioning service, and registers everything in the NestJS module. Works for both creating a new API from scratch and syncing an existing API after entity changes. Use when adding a new entity's API, adding or removing fields, or changing relationship types.
---

# Comet GraphQL API

## Overview

This skill generates a complete GraphQL CRUD API for a NestJS + MikroORM + `@nestjs/graphql` entity following the Comet DXP conventions. Output files go directly in the feature module folder — never in a `generated/` subfolder.

Files produced per entity:
- `dto/paginated-{{entity-names}}.ts` — paginated list response
- `dto/{{entity-name}}.sort.ts` — sort enum + sort input
- `dto/{{entity-name}}.filter.ts` — filter input type
- `dto/{{entity-name}}.args.ts` — list query args (search, filter, sort, pagination)
- `dto/{{entity-name}}.input.ts` — create + update input types
- `dto/{{entity-name}}-nested-{{related-name}}.input.ts` — one per OneToMany / join-table relationship
- `{{entity-name}}.resolver.ts` — resolver with CRUD queries and mutations
- `{{entity-names}}.service.ts` — positioning service (only when entity has a `position` field)

**Reference files** (read these for real-world examples):
- `examples/product/product.resolver.ts`
- `examples/product/dto/product.input.ts`
- `examples/product/dto/product.filter.ts`
- `examples/product/dto/product.sort.ts`
- `examples/product/dto/products.args.ts`
- `examples/product/dto/paginated-products.ts`

**Template files** (in `templates/`):
Use these as starting skeletons. Substitute all `{{Placeholder}}` values before writing.

## Placeholder Reference

| Placeholder | Meaning | Example |
|---|---|---|
| `{{EntityName}}` | PascalCase singular | `Product` |
| `{{entityName}}` | camelCase singular | `product` |
| `{{EntityNames}}` | PascalCase plural | `Products` |
| `{{entityNames}}` | camelCase plural | `products` |
| `{{entity-name}}` | kebab-case singular | `product` |
| `{{entity-names}}` | kebab-case plural | `products` |
| `{{RequiredPermission}}` | permission key string | `products` |
| `{{RelatedEntityName}}` | PascalCase of related entity | `ProductVariant` |
| `{{related-entity-name}}` | kebab-case of related entity | `product-variant` |

## Mode Detection

**Before generating anything**, check whether API files already exist in the feature folder:
- If `{{entity-name}}.resolver.ts` does **not** exist → **Create mode**
- If it **does** exist → **Update/Sync mode**

## Workflow — Create Mode

### Step 1: Analyze the entity

Read the entity file carefully. Identify:
- **Entity class name** and file path
- **Permission** — read the `@CrudGenerator({ requiredPermission })` decorator
- **Scalar fields**: name, TypeScript type, nullable?, is it a slug?
- **Enum fields**: which enum type, is it a single value or array?
- **Relationship fields** and their type (ManyToOne, OneToMany, ManyToMany, OneToOne)
- **Block fields** (fields typed as block data, usually `@Property({ type: "json" })` with a block type)
- Whether entity has a `position` field (for ordering)
- Whether entity has a `slug` field (unique string identifier)
- Whether `@CrudGenerator` references a `hooksService` (affects create mutation return type)
- Whether `@CrudGenerator` has `position: { groupByFields: [...] }` (affects positioning service)
- **Scope mode** (detect which case applies — see _Scope Handling_ section for what to generate):
  - **Case c – @ScopedEntity**: entity has `@ScopedEntity(...)` decorator → identify the parent entity class and its relation field name from the decorator function/service; derive `{{parentEntityIdArg}}` (e.g. `newsId` for parent `News`)
  - **Case b – scope field**: no `@ScopedEntity`, but entity has an embedded `scope` field → note the scope type class (e.g. `NewsContentScope`)
  - **Case a – no scope**: neither of the above → ask the user: _"This entity has no scope. Should a `@ScopedEntity` decorator be added to it?"_ If yes, stop and add it first; then re-detect. If no, continue with `skipScopeCheck`.

### Step 2: Determine output directory

Put all files directly in the entity's feature folder (same level as `entities/`):
```
src/{{entity-names}}/
├── entities/
│   └── {{entity-name}}.entity.ts   ← input
├── dto/                             ← create this folder if it doesn't exist
│   ├── paginated-{{entity-names}}.ts
│   ├── {{entity-name}}.sort.ts
│   ├── {{entity-name}}.filter.ts
│   ├── {{entity-name}}.args.ts
│   ├── {{entity-name}}.input.ts
│   └── {{entity-name}}-nested-*.input.ts
├── {{entity-name}}.resolver.ts
└── {{entity-names}}.service.ts      ← only if position field exists
```

### Step 3: Generate `dto/paginated-{{entity-names}}.ts`

Use template `templates/paginated.template.ts`. This file is always identical — just substitute entity name and adjust the import path to the entity.

### Step 4: Generate `dto/{{entity-name}}.sort.ts`

Use template `templates/sort.template.ts`.

**Sortable fields** (add to enum):
- All scalar fields that are stored in the DB column (string, number, boolean, Date, enum)
- The `id` column
- `createdAt`, `updatedAt` (always include)
- For each ManyToOne **and OneToOne** relation: add the relation field itself (e.g. `category`) **plus** joined scalar fields from the related entity with underscore notation (`category_title`, `category_slug`, `manufacturer_name`, `statistics_views`, etc.)
- Do **not** add OneToMany, ManyToMany, or block fields

### Step 5: Generate `dto/{{entity-name}}.filter.ts`

Use template `templates/filter.template.ts`.

**Field-type → filter class mapping**:
| TypeScript type | Filter class | Notes |
|---|---|---|
| `string` | `StringFilter` | |
| `number` | `NumberFilter` | |
| `boolean` | `BooleanFilter` | |
| `Date` (DateTime / timestamp) | `DateTimeFilter` | |
| `Date` (LocalDate, `GraphQLLocalDate`) | `DateFilter` | |
| single-value enum | `createEnumFilter(EnumType)` | Declare a class: `class XxxEnumFilter extends createEnumFilter(Xxx) {}` |
| array enum | `createEnumsFilter(EnumType)` | Declare a class: `class XxxEnumsFilter extends createEnumsFilter(Xxx) {}` |
| ManyToOne | `ManyToOneFilter` | |
| OneToMany | `OneToManyFilter` | |
| ManyToMany | `ManyToManyFilter` | |
| `id` (PK) | `IdFilter` | Always include |
| Block fields | — | Not filterable, skip |
| JSON / embedded | — | Not filterable, skip |

Always include `createdAt`, `updatedAt`, and the `and`/`or` compound filter fields.

### Step 6: Generate `dto/{{entity-name}}.args.ts`

Use template `templates/args.template.ts`. This file is mechanical — just substitute the entity name. The default sort uses `createdAt ASC`.

### Step 7: Generate `dto/{{entity-name}}.input.ts`

Use template `templates/input.template.ts`. This is the most entity-specific file.

**Scalar field → input field mapping**:
| TypeScript type | Decorators | `@Field` type |
|---|---|---|
| `string` (required) | `@IsNotEmpty() @IsString()` | `@Field()` |
| `string` (nullable) | `@IsNullable() @IsString()` | `@Field({ nullable: true, defaultValue: null })` |
| `string` (slug) | `@IsNotEmpty() @IsString() @IsSlug()` | `@Field()` |
| `number` (required) | `@IsNotEmpty() @IsNumber()` | `@Field()` |
| `number` (nullable) | `@IsNullable() @IsNumber()` | `@Field({ nullable: true, defaultValue: null })` |
| `boolean` | `@IsNotEmpty() @IsBoolean()` | `@Field({ defaultValue: true })` |
| `enum` (required) | `@IsNotEmpty() @IsEnum(MyEnum)` | `@Field(() => MyEnum)` |
| `enum[]` | `@IsEnum(MyEnum, { each: true })` | `@Field(() => [MyEnum], { defaultValue: [] })` |
| LocalDate string | `@IsNullable() @IsDateString()` | `@Field(() => GraphQLLocalDate, { nullable: true, defaultValue: null })` |
| `Date` (DateTime) | `@IsNullable() @IsDate()` | `@Field({ nullable: true, defaultValue: null })` |
| Block field | `@IsNotEmpty() @Transform(...) @ValidateNested()` | `@Field(() => RootBlockInputScalar(BlockType))` |

**Relationship → input field mapping**:
| Relationship | Input field | Decorators |
|---|---|---|
| ManyToOne (nullable, UUID PK) | `@Field(() => ID, { nullable: true, defaultValue: null }) field?: string` | `@IsNullable() @IsUUID()` |
| ManyToOne (required, UUID PK) | `@Field(() => ID) field: string` | `@IsNotEmpty() @IsUUID()` |
| ManyToOne (nullable, non-UUID PK e.g. FileUpload) | `@Field(() => ID, { nullable: true, defaultValue: null }) field?: string` | `@IsNullable() @IsString()` |
| ManyToMany (UUID IDs) | `@Field(() => [ID], { defaultValue: [] }) field: string[]` | `@IsArray() @IsUUID(undefined, { each: true })` |
| ManyToMany (non-UUID IDs e.g. FileUpload) | `@Field(() => [ID], { defaultValue: [] }) field: string[]` | `@IsArray() @IsString({ each: true })` |
| OneToMany (owned, nested) | `@Field(() => [XxxNestedYyyInput], { defaultValue: [] }) field: XxxNestedYyyInput[]` | `@IsArray() @Type(() => ...) @ValidateNested({ each: true })` |
| OneToOne (nested, nullable) | `@Field(() => XxxNestedYyyInput, { nullable: true }) field?: XxxNestedYyyInput` | `@IsNullable() @Type(() => ...) @ValidateNested()` |

The `UpdateInput` is always just `export class {{EntityName}}UpdateInput extends PartialType({{EntityName}}Input) {}`.

### Step 8: Generate nested input files (OneToMany / join-table relationships)

For each OneToMany or join-table relationship where the parent resolver manages the child:
- Create `dto/{{entity-name}}-nested-{{related-entity-name}}.input.ts`
- Use template `templates/nested-input.template.ts`
- Include only the fields that can be set on the child from the parent's input
- Do NOT include the back-reference FK field (e.g. `product` on `ProductVariant`)
- For join-table entities (e.g. `ProductToTag`), include the join-side FK (e.g. `tag: string`) plus any extra fields on the join entity (e.g. `exampleStatus`)

### Step 9: Generate `{{entity-name}}.resolver.ts`

Use template `templates/resolver.template.ts`.

Key decisions:
- **Scope mode**: determine which scope case (a/b/c) applies and apply the corresponding changes — see _Scope Handling_ section below
- **`bySlug` query**: add if entity has a unique `slug` field
- **Create mutation return type**:
  - With `hooksService`: return `Create{{EntityName}}Payload` (has `errors[]` array). Inject and call `validateCreateInput`.
  - Without `hooksService`: return `{{EntityName}}` directly.
- **`populate` array**: add an `if (fields.includes("fieldName")) populate.push("fieldName")` block for each relationship field
- **Destructuring**: pull out all relationship/block fields from input before spreading into `create`/`assign`
- **`@ResolveField`** for each relationship:
  - ManyToOne: `return entity.relation?.loadOrFail()` (nullable) or `entity.relation.loadOrFail()` (required)
  - OneToMany: `return entity.collection.loadItems()`
  - ManyToMany: `return entity.collection.loadItems()`
  - OneToOne: `return entity.relation?.loadOrFail()` (nullable)
  - Block field: `return this.blocksTransformer.transformToPlain(entity.blockField)`

### Step 10: Generate positioning service (if applicable)

Only create `{{entity-names}}.service.ts` if the entity has a `position` field.
Use template `templates/position-service.template.ts`.

- Use the **simple variant** (no `group` parameter) when there are no `groupByFields` in `@CrudGenerator`
- Use the **grouped variant** when `position: { groupByFields: ["parentField"] }` is set

### Step 11: Register in the NestJS module

Find the feature module file (e.g. `products.module.ts`). Update it:

1. **`providers` array** — add the new resolver and (if generated) the positioning service:
   ```typescript
   providers: [
       // ...existing providers...
       {{EntityName}}Resolver,
       {{EntityNames}}Service, // only if position field exists
   ],
   ```

2. **`MikroOrmModule.forFeature([...])`** — ensure the entity itself is listed. Also add any related entity classes that the resolver injects via `EntityManager` (typically entities used in `findOneOrFail` calls for relationship resolution):
   ```typescript
   MikroOrmModule.forFeature([
       // ...existing entities...
       {{EntityName}},
       RelatedEntity, // if not already registered
   ]),
   ```

3. Add import statements at the top of the module file for the new resolver/service classes.

### Step 12: Lint

Run in the package folder (the `api` package where the files were changed):
```bash
pnpm run lint:eslint --fix
```

---

## Workflow — Update/Sync Mode

### Step 1: Check if entity needs updating first

If the user describes a desired change (e.g. "add a `rating` field") and the entity file does **not** yet have that change:
1. Update the entity first — add/remove/modify `@Property()`, `@ManyToOne()`, etc. decorators
2. Then proceed to sync the API files

If the entity is already updated, skip to step 2.

### Step 2: Read all existing API files

Read the entity file and all existing API files:
- `{{entity-name}}.resolver.ts`
- `dto/{{entity-name}}.input.ts`
- `dto/{{entity-name}}.filter.ts`
- `dto/{{entity-name}}.sort.ts`
- `dto/{{entity-name}}.args.ts`
- `dto/paginated-{{entity-names}}.ts`
- Any nested input files

### Step 3: Diff — what changed?

Compare entity fields to what the API currently exposes. List:
- **Added fields**: need to be added to input, filter, sort, and resolver
- **Removed fields**: need to be removed from input, filter, sort, and resolver
- **Changed types**: update validators and field types accordingly
- **Added relationships**: may need new nested input files and new ResolveFields
- **Removed relationships**: remove nested input files and ResolveFields

### Step 4: Apply changes to each file

Update files in this order:
1. `dto/{{entity-name}}.input.ts` — add/remove/update fields and validators
2. `dto/{{entity-name}}.filter.ts` — add/remove filter fields
3. `dto/{{entity-name}}.sort.ts` — add/remove sort enum values
4. Nested input files — create new ones, delete obsolete ones
5. `{{entity-name}}.resolver.ts` — update destructuring in create/update, update `populate` array, add/remove `@ResolveField`s
6. `dto/{{entity-name}}.args.ts` — usually no change needed
7. `dto/paginated-{{entity-names}}.ts` — usually no change needed
8. If `position` field was added → create `{{entity-names}}.service.ts`
9. If `position` field was removed → delete `{{entity-names}}.service.ts`

### Step 5: Update module registration

If entities or providers changed:
- Add new entities to `MikroOrmModule.forFeature([...])`
- Add/remove resolver or service in `providers`

### Step 6: Lint

```bash
pnpm run lint:eslint --fix
```

---

## Field Handling Quick Reference

### Block field (e.g. DamImageBlock)

Entity:
```typescript
@Property({ type: "json" })
image: BlockDataInterface;
```

Input:
```typescript
@IsNotEmpty()
@Field(() => RootBlockInputScalar(DamImageBlock))
@Transform(({ value }) => (isBlockInputInterface(value) ? value : DamImageBlock.blockInputFactory(value)), { toClassOnly: true })
@ValidateNested()
image: BlockInputInterface;
```

Resolver create:
```typescript
image: imageInput.transformToBlockData(),
```

Resolver update:
```typescript
if (imageInput) {
    entity.image = imageInput.transformToBlockData();
}
```

ResolveField:
```typescript
@ResolveField(() => RootBlockDataScalar(DamImageBlock))
async image(@Parent() entity: MyEntity): Promise<object> {
    return this.blocksTransformer.transformToPlain(entity.image);
}
```

### OneToMany (nested, orphan removal)

Entity:
```typescript
@OneToMany(() => NestedEntity, (nested) => nested.parent, { orphanRemoval: true })
items = new Collection<NestedEntity>(this);
```

Resolver create/update:
```typescript
if (itemsInput) {
    await entity.items.loadItems();
    entity.items.set(
        itemsInput.map((itemInput) => {
            const item = this.entityManager.assign(new NestedEntity(), { ...itemInput });
            return item;
        }),
    );
}
```

### ManyToMany (IDs)

Entity:
```typescript
@ManyToMany(() => TagEntity, undefined, { owner: true })
tags = new Collection<TagEntity>(this);
```

Resolver create/update:
```typescript
if (tagsInput) {
    const tags = await this.entityManager.find(TagEntity, { id: tagsInput });
    if (tags.length != tagsInput.length) throw new Error("Couldn't find all tags that were passed as input");
    await entity.tags.loadItems();
    entity.tags.set(tags.map((tag) => Reference.create(tag)));
}
```

### ManyToOne (required, UUID)

Entity:
```typescript
@ManyToOne(() => RelatedEntity, { ref: true })
author: Ref<RelatedEntity>;
```

Resolver create:
```typescript
author: Reference.create(await this.entityManager.findOneOrFail(RelatedEntity, authorInput)),
```

Resolver update (always reassign if present in partial input — no null check needed):
```typescript
if (authorInput !== undefined) {
    entity.author = Reference.create(await this.entityManager.findOneOrFail(RelatedEntity, authorInput));
}
```

### ManyToOne (nullable, UUID)

Entity:
```typescript
@ManyToOne(() => RelatedEntity, { nullable: true, ref: true })
category?: Ref<RelatedEntity>;
```

Resolver create:
```typescript
category: categoryInput
    ? Reference.create(await this.entityManager.findOneOrFail(RelatedEntity, categoryInput))
    : undefined,
```

Resolver update (nullable, may be unset):
```typescript
if (categoryInput !== undefined) {
    entity.category = categoryInput
        ? Reference.create(await this.entityManager.findOneOrFail(RelatedEntity, categoryInput))
        : undefined;
}
```

### OneToOne (nested, nullable)

Entity:
```typescript
@OneToOne(() => NestedEntity, { nullable: true, ref: true, orphanRemoval: true })
statistics?: Ref<NestedEntity>;
```

Resolver create:
```typescript
if (statisticsInput) {
    const statistic = new NestedEntity();
    this.entityManager.assign(statistic, { ...statisticsInput });
}
```

Resolver update (load existing or create new):
```typescript
if (statisticsInput) {
    const statistic = entity.statistics ? await entity.statistics.loadOrFail() : new NestedEntity();
    this.entityManager.assign(statistic, { ...statisticsInput });
}
```

### Join-table / ManyToMany with extra fields (nested input with FK)

Use this when the nested input contains a relation FK field (e.g., a join entity like `ProductToTag` that holds `tag` + extra fields). The map callback must be `async` and the whole block wrapped in `Promise.all()`.

Resolver create/update:
```typescript
if (tagsWithStatusInput) {
    await entity.tagsWithStatus.loadItems();
    entity.tagsWithStatus.set(
        await Promise.all(
            tagsWithStatusInput.map(async (tagsWithStatusInput) => {
                const { tag: tagInput, ...assignInput } = tagsWithStatusInput;
                const tagsWithStatus = this.entityManager.assign(new JoinEntity(), {
                    ...assignInput,
                    tag: Reference.create(await this.entityManager.findOneOrFail(TagEntity, tagInput)),
                });
                return tagsWithStatus;
            }),
        ),
    );
}
```

### Embedded / JSON complex type (not a relation)

If the entity has a field typed as an `@Embeddable()` class or a plain `@Property({ type: "json" })` class, use `@ValidateNested()` with `@Type(() => TheClass)` in the input. The class itself is used directly as the input type (it must be an `@InputType()` or already a `@ObjectType()` that doubles as input — check how it's used in the real code).

Array of embeddables:
```typescript
@IsNotEmpty()
@IsArray()
@ValidateNested()
@Type(() => MyEmbeddable)
@Field(() => [MyEmbeddable], { defaultValue: [] })
items: MyEmbeddable[];
```

Nullable single embeddable:
```typescript
@IsNullable()
@ValidateNested()
@Type(() => MyEmbeddable)
@Field(() => MyEmbeddable, { nullable: true })
item?: MyEmbeddable;
```

---

## Scope Handling

Scope controls which data a user is allowed to access. Apply the correct pattern based on the scope mode detected in Step 1.

### Case a – No scope

The entity has no `scope` field and no `@ScopedEntity` decorator.

- Before generating, ask the user: _"This entity has no scope. Should a `@ScopedEntity` decorator be added to it?"_
  - If **yes**: stop, add `@ScopedEntity` to the entity, then re-run scope detection.
  - If **no**: continue with `skipScopeCheck`.
- Use `@RequiredPermission(["{{RequiredPermission}}"], { skipScopeCheck: true })` on the resolver class.
- `@AffectedEntity({{EntityName}})` on detail query, update mutation, delete mutation (unchanged).
- No changes to list query or create mutation.

### Case b – Scope field

The entity has an embedded `scope` field (e.g. `scope: NewsContentScope`).

**`@RequiredPermission`**: remove `skipScopeCheck`:
```typescript
@RequiredPermission(["{{RequiredPermission}}"])
```

**Args file**: When the entity name is the same in singular and plural (e.g., "news"), the args file must use a `-list` suffix to avoid a name collision with the single-entity query: `dto/{{entity-name}}-list.args.ts` with class `{{EntityName}}ListArgs`. For entities with distinct singular and plural (e.g., "product" / "products"), use `dto/{{entity-names}}.args.ts` with class `{{EntityNames}}Args` as usual.

Add `scope` as the **first** field (no `@IsNotEmpty()`):
```typescript
@Field(() => {{ScopeType}})
@ValidateNested()
@Type(() => {{ScopeType}})
scope: {{ScopeType}};
```

**List query**: destructure `scope` from args, apply to where. When singular==plural use `{{entityName}}List` as the method name and `{{EntityName}}ListArgs` as the type (import from `-list.args.ts`); otherwise use `{{entityNames}}` and `{{EntityNames}}Args`:
```typescript
async {{entityNames}}(   // or {{entityName}}List when singular==plural
    @Args()
    { scope, search, filter, sort, offset, limit }: {{EntityNames}}Args,  // or {{EntityName}}ListArgs
    ...
): Promise<Paginated{{EntityNames}}> {
    const where = gqlArgsToMikroOrmQuery({ search, filter }, ...);
    where.scope = scope;
    ...
}
```

**Create mutation**: add `scope` as a separate `@Args` before `input`:
```typescript
@Mutation(() => {{EntityName}})
async create{{EntityName}}(
    @Args("scope", { type: () => {{ScopeType}} })
    scope: {{ScopeType}},
    @Args("input", { type: () => {{EntityName}}Input })
    input: {{EntityName}}Input,
): Promise<{{EntityName}}> {
    const { ...assignInput } = input;
    const {{entityName}} = this.entityManager.create({{EntityName}}, {
        ...assignInput,
        scope,
    });
    await this.entityManager.flush();
    return {{entityName}};
}
```

**`bySlug` query** (if the entity has a slug): also add `scope` arg and filter on `{ slug, scope }`:
```typescript
@Query(() => {{EntityName}}, { nullable: true })
async {{entityName}}BySlug(
    @Args("slug") slug: string,
    @Args("scope", { type: () => {{ScopeType}} }) scope: {{ScopeType}},
): Promise<{{EntityName}} | null> {
    return this.entityManager.findOne({{EntityName}}, { slug, scope }) ?? null;
}
```

**`@AffectedEntity`**: keep on detail query, update mutation, delete mutation (unchanged).

Reference: `examples/news/news.resolver.ts`

### Case c – @ScopedEntity

The entity has a `@ScopedEntity(...)` decorator — it derives its scope from a parent entity via a relation.

First, identify:
- `{{ParentEntityName}}` — the parent entity class (e.g. `News`)
- `{{parentRelationField}}` — the relation field name on the entity pointing to the parent (e.g. `news`)
- `{{parentEntityIdArg}}` — the GraphQL arg name for the parent ID (e.g. `newsId`)

**`@RequiredPermission`**: remove `skipScopeCheck`:
```typescript
@RequiredPermission(["{{RequiredPermission}}"])
```

**Detail query, update mutation, delete mutation**: keep `@AffectedEntity({{EntityName}})` (the entity itself).

**List query**: add `@AffectedEntity({{ParentEntityName}}, { idArg: "{{parentEntityIdArg}}" })` and filter by parent:
```typescript
@Query(() => Paginated{{EntityNames}})
@AffectedEntity({{ParentEntityName}}, { idArg: "{{parentEntityIdArg}}" })
async {{entityNames}}(
    @Args("{{parentEntityIdArg}}", { type: () => ID })
    {{parentEntityIdArg}}: string,
    @Args()
    { search, filter, sort, offset, limit }: {{EntityNames}}Args,
    @Info()
    info: GraphQLResolveInfo,
): Promise<Paginated{{EntityNames}}> {
    const where = gqlArgsToMikroOrmQuery({ search, filter }, ...);
    where.{{parentRelationField}} = {{parentEntityIdArg}};
    ...
}
```

**Create mutation**: add `@AffectedEntity({{ParentEntityName}}, { idArg: "{{parentEntityIdArg}}" })`, load parent, assign to entity:
```typescript
@Mutation(() => {{EntityName}})
@AffectedEntity({{ParentEntityName}}, { idArg: "{{parentEntityIdArg}}" })
async create{{EntityName}}(
    @Args("{{parentEntityIdArg}}", { type: () => ID })
    {{parentEntityIdArg}}: string,
    @Args("input", { type: () => {{EntityName}}Input })
    input: {{EntityName}}Input,
): Promise<{{EntityName}}> {
    const {{parentRelationField}} = await this.entityManager.findOneOrFail({{ParentEntityName}}, {{parentEntityIdArg}});
    const { ...assignInput } = input;
    const {{entityName}} = this.entityManager.create({{EntityName}}, {
        ...assignInput,
        {{parentRelationField}},
    });
    await this.entityManager.flush();
    return {{entityName}};
}
```

Reference: `examples/news-comment/news-comment.resolver.ts`

---

## Consistency Checklist

- [ ] All relationship fields handled in resolver create AND update mutations
- [ ] All relationship fields have a corresponding `@ResolveField`
- [ ] All relationship fields added to `populate` in the list query (conditional on `extractGraphqlFields`)
- [ ] `UpdateInput` extends `PartialType(Input)` — nothing more needed
- [ ] Sort enum includes `createdAt` and `updatedAt`
- [ ] Filter includes `and`/`or` compound fields
- [ ] New resolver and service (if any) are in module `providers`
- [ ] All entities used in resolver are in `MikroOrmModule.forFeature`
- [ ] ESLint fix run after all files are written
- [ ] Scope mode (a/b/c) detected and applied:
  - Case a: `skipScopeCheck: true` on `@RequiredPermission`; user asked about `@ScopedEntity`
  - Case b: no `skipScopeCheck`; `scope` arg in list args DTO + create mutation (+ `bySlug` if applicable)
  - Case c: no `skipScopeCheck`; `@AffectedEntity(ParentEntity)` on list + create; `@AffectedEntity(Entity)` on detail/update/delete

## Minimal Acceptance Criteria

- TypeScript compiles in the API package without errors
- GraphQL schema includes the new entity's queries and mutations
- Create, update, delete, and list operations work correctly via GraphQL playground
- Related entities resolve correctly via `@ResolveField`
- Module registration is complete (no "unknown provider" runtime errors)
