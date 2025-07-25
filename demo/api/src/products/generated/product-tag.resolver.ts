// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { EntityManager, FindOptions, Reference } from "@mikro-orm/postgresql";
import { Args, ID, Info, Mutation, Query, Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { ProductTagInput, ProductTagUpdateInput } from "./dto/product-tag.input";
import { PaginatedProductTags } from "./dto/paginated-product-tags";
import { ProductTagsArgs } from "./dto/product-tags.args";
import { ProductToTag } from "../entities/product-to-tag.entity";
import { Product } from "../entities/product.entity";
import { ProductTag } from "../entities/product-tag.entity";
import { AffectedEntity, RequiredPermission, extractGraphqlFields, gqlArgsToMikroOrmQuery } from "@comet/cms-api";
@Resolver(() => ProductTag)
@RequiredPermission(["products"], { skipScopeCheck: true })
export class ProductTagResolver {
    constructor(protected readonly entityManager: EntityManager) { }
    @Query(() => ProductTag)
    @AffectedEntity(ProductTag)
    async productTag(
    @Args("id", { type: () => ID })
    id: string): Promise<ProductTag> {
        const productTag = await this.entityManager.findOneOrFail(ProductTag, id);
        return productTag;
    }
    @Query(() => PaginatedProductTags)
    async productTags(
    @Args()
    { search, filter, sort, offset, limit }: ProductTagsArgs, 
    @Info()
    info: GraphQLResolveInfo): Promise<PaginatedProductTags> {
        const where = gqlArgsToMikroOrmQuery({ search, filter, }, this.entityManager.getMetadata(ProductTag));
        const fields = extractGraphqlFields(info, { root: "nodes" });
        const populate: string[] = [];
        if (fields.includes("productsWithStatus")) {
            populate.push("productsWithStatus");
        }
        if (fields.includes("products")) {
            populate.push("products");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: FindOptions<ProductTag, any> = { offset, limit, populate };
        if (sort) {
            options.orderBy = sort.map((sortItem) => {
                return {
                    [sortItem.field]: sortItem.direction,
                };
            });
        }
        const [entities, totalCount] = await this.entityManager.findAndCount(ProductTag, where, options);
        return new PaginatedProductTags(entities, totalCount);
    }
    @Mutation(() => ProductTag)
    async createProductTag(
    @Args("input", { type: () => ProductTagInput })
    input: ProductTagInput): Promise<ProductTag> {
        const { productsWithStatus: productsWithStatusInput, products: productsInput, ...assignInput } = input;
        const productTag = this.entityManager.create(ProductTag, {
            ...assignInput,
        });
        if (productsWithStatusInput) {
            await productTag.productsWithStatus.loadItems();
            productTag.productsWithStatus.set(await Promise.all(productsWithStatusInput.map(async (productsWithStatusInput) => {
                const { product: productInput, ...assignInput } = productsWithStatusInput;
                return this.entityManager.assign(new ProductToTag(), {
                    ...assignInput,
                    product: Reference.create(await this.entityManager.findOneOrFail(Product, productInput)),
                });
            })));
        }
        if (productsInput) {
            const products = await this.entityManager.find(Product, { id: productsInput });
            if (products.length != productsInput.length)
                throw new Error("Couldn't find all products that were passed as input");
            await productTag.products.loadItems();
            productTag.products.set(products.map((product) => Reference.create(product)));
        }
        await this.entityManager.flush();
        return productTag;
    }
    @Mutation(() => ProductTag)
    @AffectedEntity(ProductTag)
    async updateProductTag(
    @Args("id", { type: () => ID })
    id: string, 
    @Args("input", { type: () => ProductTagUpdateInput })
    input: ProductTagUpdateInput): Promise<ProductTag> {
        const productTag = await this.entityManager.findOneOrFail(ProductTag, id);
        const { productsWithStatus: productsWithStatusInput, products: productsInput, ...assignInput } = input;
        productTag.assign({
            ...assignInput,
        });
        if (productsWithStatusInput) {
            await productTag.productsWithStatus.loadItems();
            productTag.productsWithStatus.set(await Promise.all(productsWithStatusInput.map(async (productsWithStatusInput) => {
                const { product: productInput, ...assignInput } = productsWithStatusInput;
                return this.entityManager.assign(new ProductToTag(), {
                    ...assignInput,
                    product: Reference.create(await this.entityManager.findOneOrFail(Product, productInput)),
                });
            })));
        }
        if (productsInput) {
            const products = await this.entityManager.find(Product, { id: productsInput });
            if (products.length != productsInput.length)
                throw new Error("Couldn't find all products that were passed as input");
            await productTag.products.loadItems();
            productTag.products.set(products.map((product) => Reference.create(product)));
        }
        await this.entityManager.flush();
        return productTag;
    }
    @Mutation(() => Boolean)
    @AffectedEntity(ProductTag)
    async deleteProductTag(
    @Args("id", { type: () => ID })
    id: string): Promise<boolean> {
        const productTag = await this.entityManager.findOneOrFail(ProductTag, id);
        this.entityManager.remove(productTag);
        await this.entityManager.flush();
        return true;
    }
    @ResolveField(() => [ProductToTag])
    async productsWithStatus(
    @Parent()
    productTag: ProductTag): Promise<ProductToTag[]> {
        return productTag.productsWithStatus.loadItems();
    }
    @ResolveField(() => [Product])
    async products(
    @Parent()
    productTag: ProductTag): Promise<Product[]> {
        return productTag.products.loadItems();
    }
}
