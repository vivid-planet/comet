import { gqlArgsToMikroOrmQuery, gqlSortToMikroOrmOrderBy, SortDirection } from "@comet/cms-api";
import { EntityManager, FindOptions } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Tool } from "@rekog/mcp-nest";
import { z } from "zod";

import { Product } from "./entities/product.entity";
import { ProductSortField } from "./generated/dto/product.sort";

@Injectable()
export class ProductMcpTool {
    constructor(private readonly entityManager: EntityManager) {}

    @Tool({
        name: "get-product",
        description: "Get a single product by its ID",
        parameters: z.object({
            id: z.string().describe("The UUID of the product"),
        }),
    })
    async getProduct({ id }: { id: string }) {
        const product = await this.entityManager.findOne(Product, id);
        if (!product) {
            return `Product with ID "${id}" not found.`;
        }
        return JSON.stringify(this.formatProduct(product));
    }

    @Tool({
        name: "get-product-by-slug",
        description: "Get a single product by its slug",
        parameters: z.object({
            slug: z.string().describe("The slug of the product"),
        }),
    })
    async getProductBySlug({ slug }: { slug: string }) {
        const product = await this.entityManager.findOne(Product, { slug });
        if (!product) {
            return `Product with slug "${slug}" not found.`;
        }
        return JSON.stringify(this.formatProduct(product));
    }

    @Tool({
        name: "list-products",
        description: "List products with optional search, pagination, and sorting",
        parameters: z.object({
            search: z.string().optional().describe("Search term to filter products by title"),
            offset: z.number().int().min(0).default(0).describe("Pagination offset"),
            limit: z.number().int().min(1).max(100).default(25).describe("Number of products to return (max 100)"),
            sortField: z.enum(["title", "createdAt", "price"]).default("createdAt").describe("Field to sort by"),
            sortDirection: z.enum(["ASC", "DESC"]).default("DESC").describe("Sort direction"),
        }),
    })
    async listProducts({
        search,
        offset,
        limit,
        sortField,
        sortDirection,
    }: {
        search?: string;
        offset: number;
        limit: number;
        sortField: string;
        sortDirection: string;
    }) {
        const where = search ? gqlArgsToMikroOrmQuery({ search, filter: undefined }, this.entityManager.getMetadata(Product)) : {};
        const options: FindOptions<Product> = { offset, limit };

        const sortFieldMapping: Record<string, ProductSortField> = {
            title: ProductSortField.title,
            createdAt: ProductSortField.createdAt,
            price: ProductSortField.price,
        };

        options.orderBy = gqlSortToMikroOrmOrderBy([
            {
                field: sortFieldMapping[sortField] ?? ProductSortField.createdAt,
                direction: sortDirection === "ASC" ? SortDirection.ASC : SortDirection.DESC,
            },
        ]);

        const [entities, totalCount] = await this.entityManager.findAndCount(Product, where, options);

        return JSON.stringify({
            products: entities.map((product) => this.formatProduct(product)),
            totalCount,
            offset,
            limit,
        });
    }

    private formatProduct(product: Product) {
        return {
            id: product.id,
            title: product.title,
            slug: product.slug,
            description: product.description,
            type: product.type,
            status: product.status,
            price: product.price,
            inStock: product.inStock,
            availableSince: product.availableSince,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}
