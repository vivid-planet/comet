import { EntityManager, FindOptions, Reference } from "@mikro-orm/postgresql";
import { Args, ID, Info, Mutation, Query, Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { {{EntityName}}Input, {{EntityName}}UpdateInput } from "./dto/{{entity-name}}.input";
import { Paginated{{EntityNames}} } from "./dto/paginated-{{entity-names}}";
import { {{EntityNames}}Args } from "./dto/{{entity-names}}.args";
import {
    AffectedEntity,
    RequiredPermission,
    extractGraphqlFields,
    gqlArgsToMikroOrmQuery,
    gqlSortToMikroOrmOrderBy,
} from "@comet/cms-api";
// For block fields also import:
// import { BlocksTransformerService, RootBlockDataScalar, DamImageBlock } from "@comet/cms-api";
// For mutations that return errors (when a hooksService is used):
// import { CurrentUser, GetCurrentUser } from "@comet/cms-api";
import { {{EntityName}} } from "./entities/{{entity-name}}.entity";
// Import related entity classes used in ResolveFields and create/update mutations:
// import { RelatedEntity } from "./entities/related-entity.entity";
// Import the hooks service if the entity uses one:
// import { {{EntityName}}Service } from "./{{entity-name}}.service";
// import { {{EntityName}}MutationError } from "./{{entity-name}}.service";
// Import nested entity classes for OneToMany relationships:
// import { NestedEntity } from "./entities/nested-entity.entity";

// Uncomment if create mutation returns a payload with errors (hooksService):
// import { Field, ObjectType } from "@nestjs/graphql";
// @ObjectType()
// class Create{{EntityName}}Payload {
//     @Field(() => {{EntityName}}, { nullable: true })
//     {{entityName}}?: {{EntityName}};
//     @Field(() => [{{EntityName}}MutationError], { nullable: false })
//     errors: {{EntityName}}MutationError[];
// }

@Resolver(() => {{EntityName}})
// Scope case a (no scope field, no @ScopedEntity): keep skipScopeCheck: true
// Scope case b (scope field) or case c (@ScopedEntity): remove skipScopeCheck option entirely
@RequiredPermission(["{{RequiredPermission}}"], { skipScopeCheck: true })
export class {{EntityName}}Resolver {
    constructor(
        protected readonly entityManager: EntityManager,
        // Inject BlocksTransformerService if entity has block fields:
        // private readonly blocksTransformer: BlocksTransformerService,
        // Inject hooksService if entity has one:
        // protected readonly {{entityName}}Service: {{EntityName}}Service,
    ) {}

    @Query(() => {{EntityName}})
    @AffectedEntity({{EntityName}})
    async {{entityName}}(
        @Args("id", { type: () => ID })
        id: string,
    ): Promise<{{EntityName}}> {
        const {{entityName}} = await this.entityManager.findOneOrFail({{EntityName}}, id);
        return {{entityName}};
    }

    // Uncomment if entity has a unique `slug` field:
    // @Query(() => {{EntityName}}, { nullable: true })
    // async {{entityName}}BySlug(
    //     @Args("slug")
    //     slug: string,
    // ): Promise<{{EntityName}} | null> {
    //     const {{entityName}} = await this.entityManager.findOne({{EntityName}}, { slug });
    //     return {{entityName}} ?? null;
    // }

    @Query(() => Paginated{{EntityNames}})
    async {{entityNames}}(
        @Args()
        { search, filter, sort, offset, limit }: {{EntityNames}}Args,
        @Info()
        info: GraphQLResolveInfo,
    ): Promise<Paginated{{EntityNames}}> {
        const where = gqlArgsToMikroOrmQuery({ search, filter }, this.entityManager.getMetadata({{EntityName}}));
        const fields = extractGraphqlFields(info, { root: "nodes" });
        const populate: string[] = [];

        // Add one block per relationship field that may be requested:
        // if (fields.includes("category")) {
        //     populate.push("category");
        // }
        // if (fields.includes("variants")) {
        //     populate.push("variants");
        // }
        // if (fields.includes("tags")) {
        //     populate.push("tags");
        // }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: FindOptions<{{EntityName}}, any> = { offset, limit, populate };
        if (sort) {
            options.orderBy = gqlSortToMikroOrmOrderBy(sort);
        }
        const [entities, totalCount] = await this.entityManager.findAndCount({{EntityName}}, where, options);
        return new Paginated{{EntityNames}}(entities, totalCount);
    }

    // --- Create mutation ---
    // Option A: No hooksService — returns the entity directly.
    @Mutation(() => {{EntityName}})
    async create{{EntityName}}(
        @Args("input", { type: () => {{EntityName}}Input })
        input: {{EntityName}}Input,
    ): Promise<{{EntityName}}> {
        const {
            // Destructure relationship/block fields that need special handling:
            // category: categoryInput,
            // variants: variantsInput,
            // tags: tagsInput,
            // image: imageInput,
            ...assignInput
        } = input;
        const {{entityName}} = this.entityManager.create({{EntityName}}, {
            ...assignInput,
            // ManyToOne: category: categoryInput ? Reference.create(await this.entityManager.findOneOrFail(RelatedEntity, categoryInput)) : undefined,
            // Block field: image: imageInput.transformToBlockData(),
        });

        // OneToMany (nested, no FK in nested input):
        // if (variantsInput) {
        //     await {{entityName}}.variants.loadItems();
        //     {{entityName}}.variants.set(
        //         variantsInput.map((variantInput) => {
        //             const variant = this.entityManager.assign(new NestedEntity(), { ...variantInput });
        //             return variant;
        //         }),
        //     );
        // }

        // Join-table OneToMany (nested input contains a FK to another entity — use Promise.all + async map):
        // if (tagsWithStatusInput) {
        //     await {{entityName}}.tagsWithStatus.loadItems();
        //     {{entityName}}.tagsWithStatus.set(
        //         await Promise.all(
        //             tagsWithStatusInput.map(async (tagsWithStatusInput) => {
        //                 const { tag: tagInput, ...assignInput } = tagsWithStatusInput;
        //                 const tagsWithStatus = this.entityManager.assign(new JoinEntity(), {
        //                     ...assignInput,
        //                     tag: Reference.create(await this.entityManager.findOneOrFail(TagEntity, tagInput)),
        //                 });
        //                 return tagsWithStatus;
        //             }),
        //         ),
        //     );
        // }

        // ManyToMany (IDs):
        // if (tagsInput) {
        //     const tags = await this.entityManager.find(TagEntity, { id: tagsInput });
        //     if (tags.length != tagsInput.length) throw new Error("Couldn't find all tags that were passed as input");
        //     await {{entityName}}.tags.loadItems();
        //     {{entityName}}.tags.set(tags.map((tag) => Reference.create(tag)));
        // }

        // OneToOne (nested, create — always create a new instance):
        // if (statisticsInput) {
        //     const statistic = new NestedEntity();
        //     this.entityManager.assign(statistic, { ...statisticsInput });
        // }

        await this.entityManager.flush();
        return {{entityName}};
    }

    // Option B: With hooksService — returns a payload with errors[].
    // Replace the create mutation above with:
    //
    // @Mutation(() => Create{{EntityName}}Payload)
    // async create{{EntityName}}(
    //     @Args("input", { type: () => {{EntityName}}Input })
    //     input: {{EntityName}}Input,
    //     @GetCurrentUser()
    //     user: CurrentUser,
    // ): Promise<Create{{EntityName}}Payload> {
    //     const errors = await this.{{entityName}}Service.validateCreateInput(input, { currentUser: user });
    //     if (errors.length > 0) {
    //         return { errors };
    //     }
    //     const { ...assignInput } = input;
    //     const {{entityName}} = this.entityManager.create({{EntityName}}, { ...assignInput });
    //     await this.entityManager.flush();
    //     return { {{entityName}}, errors: [] };
    // }

    @Mutation(() => {{EntityName}})
    @AffectedEntity({{EntityName}})
    async update{{EntityName}}(
        @Args("id", { type: () => ID })
        id: string,
        @Args("input", { type: () => {{EntityName}}UpdateInput })
        input: {{EntityName}}UpdateInput,
    ): Promise<{{EntityName}}> {
        const {{entityName}} = await this.entityManager.findOneOrFail({{EntityName}}, id);
        const {
            // Destructure relationship/block fields:
            // category: categoryInput,
            // variants: variantsInput,
            // tags: tagsInput,
            // image: imageInput,
            ...assignInput
        } = input;
        {{entityName}}.assign({
            ...assignInput,
        });

        // OneToMany (nested, no FK in nested input):
        // if (variantsInput) {
        //     await {{entityName}}.variants.loadItems();
        //     {{entityName}}.variants.set(
        //         variantsInput.map((variantInput) => {
        //             const variant = this.entityManager.assign(new NestedEntity(), { ...variantInput });
        //             return variant;
        //         }),
        //     );
        // }

        // Join-table OneToMany (nested input contains a FK — use Promise.all + async map):
        // if (tagsWithStatusInput) {
        //     await {{entityName}}.tagsWithStatus.loadItems();
        //     {{entityName}}.tagsWithStatus.set(
        //         await Promise.all(
        //             tagsWithStatusInput.map(async (tagsWithStatusInput) => {
        //                 const { tag: tagInput, ...assignInput } = tagsWithStatusInput;
        //                 const tagsWithStatus = this.entityManager.assign(new JoinEntity(), {
        //                     ...assignInput,
        //                     tag: Reference.create(await this.entityManager.findOneOrFail(TagEntity, tagInput)),
        //                 });
        //                 return tagsWithStatus;
        //             }),
        //         ),
        //     );
        // }

        // ManyToMany (IDs):
        // if (tagsInput) {
        //     const tags = await this.entityManager.find(TagEntity, { id: tagsInput });
        //     if (tags.length != tagsInput.length) throw new Error("Couldn't find all tags that were passed as input");
        //     await {{entityName}}.tags.loadItems();
        //     {{entityName}}.tags.set(tags.map((tag) => Reference.create(tag)));
        // }

        // OneToOne (nested, update — load existing or create new):
        // if (statisticsInput) {
        //     const statistic = {{entityName}}.statistics ? await {{entityName}}.statistics.loadOrFail() : new NestedEntity();
        //     this.entityManager.assign(statistic, { ...statisticsInput });
        // }

        // Nullable ManyToOne update (may be set to null):
        // if (categoryInput !== undefined) {
        //     {{entityName}}.category = categoryInput
        //         ? Reference.create(await this.entityManager.findOneOrFail(RelatedEntity, categoryInput))
        //         : undefined;
        // }

        // Block field update:
        // if (imageInput) {
        //     {{entityName}}.image = imageInput.transformToBlockData();
        // }

        await this.entityManager.flush();
        return {{entityName}};
    }

    @Mutation(() => Boolean)
    @AffectedEntity({{EntityName}})
    async delete{{EntityName}}(
        @Args("id", { type: () => ID })
        id: string,
    ): Promise<boolean> {
        const {{entityName}} = await this.entityManager.findOneOrFail({{EntityName}}, id);
        this.entityManager.remove({{entityName}});
        await this.entityManager.flush();
        return true;
    }

    // --- ResolveFields ---
    // Add one @ResolveField per relationship field on the entity.

    // ManyToOne (nullable):
    // @ResolveField(() => RelatedEntity, { nullable: true })
    // async category(
    //     @Parent()
    //     {{entityName}}: {{EntityName}},
    // ): Promise<RelatedEntity | undefined> {
    //     return {{entityName}}.category?.loadOrFail();
    // }

    // ManyToOne (required):
    // @ResolveField(() => RelatedEntity)
    // async relatedEntity(
    //     @Parent()
    //     {{entityName}}: {{EntityName}},
    // ): Promise<RelatedEntity> {
    //     return {{entityName}}.relatedEntity.loadOrFail();
    // }

    // OneToMany:
    // @ResolveField(() => [NestedEntity])
    // async variants(
    //     @Parent()
    //     {{entityName}}: {{EntityName}},
    // ): Promise<NestedEntity[]> {
    //     return {{entityName}}.variants.loadItems();
    // }

    // ManyToMany:
    // @ResolveField(() => [TagEntity])
    // async tags(
    //     @Parent()
    //     {{entityName}}: {{EntityName}},
    // ): Promise<TagEntity[]> {
    //     return {{entityName}}.tags.loadItems();
    // }

    // OneToOne (nullable):
    // @ResolveField(() => RelatedEntity, { nullable: true })
    // async statistics(
    //     @Parent()
    //     {{entityName}}: {{EntityName}},
    // ): Promise<RelatedEntity | undefined> {
    //     return {{entityName}}.statistics?.loadOrFail();
    // }

    // Block field:
    // @ResolveField(() => RootBlockDataScalar(DamImageBlock))
    // async image(
    //     @Parent()
    //     {{entityName}}: {{EntityName}},
    // ): Promise<object> {
    //     return this.blocksTransformer.transformToPlain({{entityName}}.image);
    // }
}
