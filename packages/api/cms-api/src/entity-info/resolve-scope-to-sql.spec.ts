import { BaseEntity, defineConfig, Embeddable, Embedded, Entity, ManyToOne, MikroORM, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { EntityScopeServiceInterface } from "../user-permissions/decorators/scoped-entity.decorator";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { resolveScopeToSql } from "./resolve-scope-to-sql";

@Embeddable()
class ContentScopeEmbeddable {
    @Property()
    domain!: string;

    @Property()
    language!: string;
}

@Entity({ tableName: "Company" })
class Company extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Embedded(() => ContentScopeEmbeddable)
    scope!: ContentScopeEmbeddable;
}

@Entity({ tableName: "News" })
class News extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Embedded(() => ContentScopeEmbeddable)
    scope!: ContentScopeEmbeddable;
}

@Entity({ tableName: "NewsComment" })
class NewsComment extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @ManyToOne(() => News)
    news!: Ref<News>;
}

@Entity({ tableName: "Product" })
class Product extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @ManyToOne(() => Company)
    company!: Ref<Company>;
}

@Entity({ tableName: "GlobalEntity" })
class GlobalEntity extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;
}

@Injectable()
class NewsCommentScopeService implements EntityScopeServiceInterface<NewsComment> {
    async getEntityScope(): Promise<ContentScope> {
        return {};
    }
}

describe("resolveScopeToSql", () => {
    let orm: MikroORM;

    beforeAll(async () => {
        orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [Company, News, NewsComment, Product, GlobalEntity, ContentScopeEmbeddable],
            }),
        );
    });

    afterAll(async () => {
        await orm.close();
    });

    function metadataFor(entityName: string) {
        return orm.em.getMetadata().get(entityName);
    }

    describe("scope property (simple case)", () => {
        it("builds a jsonb object from the scope embeddable columns", () => {
            expect(resolveScopeToSql({ metadata: metadataFor("News"), scopedEntity: undefined })).toBe(
                `jsonb_build_object('domain', "News"."scope_domain", 'language', "News"."scope_language")`,
            );
        });

        it("prefers the scope property over @ScopedEntity metadata", () => {
            expect(resolveScopeToSql({ metadata: metadataFor("News"), scopedEntity: "company.scope" })).toBe(
                `jsonb_build_object('domain', "News"."scope_domain", 'language', "News"."scope_language")`,
            );
        });
    });

    describe("@ScopedEntity string path", () => {
        it("resolves a relation followed by an embeddable scope to a subquery", () => {
            expect(resolveScopeToSql({ metadata: metadataFor("NewsComment"), scopedEntity: "news.scope" })).toBe(
                `(SELECT jsonb_build_object('domain', "News"."scope_domain", 'language', "News"."scope_language") FROM "News" WHERE "News"."id" = "NewsComment"."news_id")`,
            );
        });
    });

    describe("@ScopedEntity object mapping", () => {
        it("resolves each field path and builds a jsonb object", () => {
            expect(resolveScopeToSql({ metadata: metadataFor("Product"), scopedEntity: { companyId: "company.id" } })).toBe(
                `jsonb_build_object('companyId', (SELECT "Company"."id" FROM "Company" WHERE "Company"."id" = "Product"."company_id"))`,
            );
        });
    });

    describe("entity without scope", () => {
        it("returns NULL::jsonb when there is neither a scope property nor @ScopedEntity metadata", () => {
            expect(resolveScopeToSql({ metadata: metadataFor("GlobalEntity"), scopedEntity: undefined })).toBe("NULL::jsonb");
        });
    });

    describe("non-SQL-convertible @ScopedEntity", () => {
        it("throws for a callback", () => {
            expect(() => resolveScopeToSql({ metadata: metadataFor("NewsComment"), scopedEntity: () => ({}) })).toThrow(/cannot be converted to SQL/);
        });

        it("throws for an injectable service", () => {
            expect(() => resolveScopeToSql({ metadata: metadataFor("NewsComment"), scopedEntity: NewsCommentScopeService })).toThrow(
                /cannot be converted to SQL/,
            );
        });
    });
});
