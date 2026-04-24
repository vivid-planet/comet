import {
    BaseEntity,
    Collection,
    defineConfig,
    Embeddable,
    Embedded,
    Entity,
    EntityManager,
    ManyToOne,
    MikroORM,
    OneToMany,
    OneToOne,
    PrimaryKey,
    Property,
    Ref,
} from "@mikro-orm/postgresql";
import { Test, type TestingModule } from "@nestjs/testing";

import { DiscoverService } from "../dependencies/discover.service";
import { ScopedEntity } from "../user-permissions/decorators/scoped-entity.decorator";
import { EntityInfoService } from "./entity-info.service";

// ProductVariant --m:1--> Product --m:1--> Manufacturer (has @Embedded AddressAsEmbeddable)
// AddressAsEmbeddable has @Embedded AlternativeAddressAsEmbeddable

@Embeddable()
class AlternativeAddressAsEmbeddable {
    @Property()
    street!: string;

    @Property()
    zip!: string;
}

@Embeddable()
class AddressAsEmbeddable {
    @Property()
    street!: string;

    @Property()
    zip!: string;

    @Embedded(() => AlternativeAddressAsEmbeddable)
    alternativeAddress!: AlternativeAddressAsEmbeddable;
}

@Entity({ tableName: "Manufacturer" })
class Manufacturer extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    name!: string;

    @Embedded(() => AddressAsEmbeddable)
    addressAsEmbeddable!: AddressAsEmbeddable;
}

@Entity({ tableName: "Product" })
class Product extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    name!: string;

    @Property({ fieldName: "url_slug" })
    slug!: string;

    @ManyToOne(() => Manufacturer)
    manufacturer!: Ref<Manufacturer>;
}

@Entity({ tableName: "Category" })
class Category extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    title!: string;

    @OneToOne(() => Category, { nullable: true })
    parent?: Ref<Category>;
}

// Tag is defined before ProductVariant so Collection<Tag> works in ProductVariant
@Entity({ tableName: "Tag" })
class Tag extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @ManyToOne(() => ProductVariant)
    productVariant!: Ref<ProductVariant>;
}

@Entity({ tableName: "ProductVariant" })
class ProductVariant extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    name!: string;

    @ManyToOne(() => Product)
    product!: Ref<Product>;

    @OneToOne(() => Category)
    category!: Ref<Category>;

    @OneToMany(() => Tag, (tag) => tag.productVariant)
    tags = new Collection<Tag>(this);
}

// Entities for scope testing

@Embeddable()
class TestScope {
    @Property({ columnType: "text" })
    domain!: string;

    @Property({ columnType: "text" })
    language!: string;
}

@Entity({ tableName: "ScopedNews" })
class ScopedNews extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    title!: string;

    @Embedded(() => TestScope)
    scope!: TestScope;
}

@Embeddable()
class CompanyScope {
    @Property({ columnType: "text" })
    domain!: string;

    @Property({ columnType: "text" })
    language!: string;
}

@Entity({ tableName: "Company" })
class Company extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    name!: string;

    @Embedded(() => CompanyScope)
    scope!: CompanyScope;
}

@Entity({ tableName: "ScopedComment" })
@ScopedEntity("news.scope")
class ScopedComment extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    text!: string;

    @ManyToOne(() => ScopedNews)
    news!: Ref<ScopedNews>;
}

@Entity({ tableName: "ScopedTask" })
@ScopedEntity({ domain: "company.scope.domain", language: "company.scope.language" })
class ScopedTask extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id!: string;

    @Property()
    description!: string;

    @ManyToOne(() => Company)
    company!: Ref<Company>;
}

const mockEntityManager = {
    getConnection: jest.fn().mockReturnValue({}),
};

describe("EntityInfoService", () => {
    let service: EntityInfoService;
    let orm: MikroORM;

    beforeAll(async () => {
        orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [
                    ProductVariant,
                    Product,
                    Manufacturer,
                    Category,
                    Tag,
                    AddressAsEmbeddable,
                    AlternativeAddressAsEmbeddable,
                    ScopedNews,
                    TestScope,
                    ScopedComment,
                    Company,
                    CompanyScope,
                    ScopedTask,
                ],
            }),
        );
    });

    afterAll(async () => {
        await orm.close();
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EntityInfoService, { provide: DiscoverService, useValue: {} }, { provide: EntityManager, useValue: mockEntityManager }],
        }).compile();

        service = module.get<EntityInfoService>(EntityInfoService);
    });

    function callResolveFieldToSql(fieldPath: string, entityName: string): string {
        const metadata = orm.em.getMetadata().get(entityName);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (service as any).resolveFieldToSql(fieldPath, metadata, metadata.tableName);
    }

    describe("resolveFieldToSql", () => {
        describe("direct fields", () => {
            it("resolves a simple field to its column name", () => {
                expect(callResolveFieldToSql("name", "ProductVariant")).toBe('"ProductVariant"."name"');
            });

            it("resolves a field with a different column name", () => {
                expect(callResolveFieldToSql("slug", "Product")).toBe('"Product"."url_slug"');
            });

            it("throws for a non-existent field", () => {
                expect(() => callResolveFieldToSql("nonExistent", "ProductVariant")).toThrow(
                    'Field "nonExistent" not found in entity "ProductVariant"',
                );
            });
        });

        describe("ManyToOne relations", () => {
            it("resolves a single-level ManyToOne relation", () => {
                expect(callResolveFieldToSql("product.name", "ProductVariant")).toBe(
                    '(SELECT "Product"."name" FROM "Product" WHERE "Product"."id" = "ProductVariant"."product_id")',
                );
            });

            it("resolves a two-level ManyToOne relation chain", () => {
                expect(callResolveFieldToSql("product.manufacturer.name", "ProductVariant")).toBe(
                    '(SELECT (SELECT "Manufacturer"."name" FROM "Manufacturer" WHERE "Manufacturer"."id" = "Product"."manufacturer_id") FROM "Product" WHERE "Product"."id" = "ProductVariant"."product_id")',
                );
            });
        });

        describe("OneToOne relations", () => {
            it("resolves a single-level OneToOne relation", () => {
                expect(callResolveFieldToSql("category.title", "ProductVariant")).toBe(
                    '(SELECT "Category"."title" FROM "Category" WHERE "Category"."id" = "ProductVariant"."category_id")',
                );
            });

            it("resolves a self-referencing OneToOne relation (n-level)", () => {
                expect(callResolveFieldToSql("category.parent.title", "ProductVariant")).toBe(
                    '(SELECT (SELECT "Category"."title" FROM "Category" WHERE "Category"."id" = "Category"."parent_id") FROM "Category" WHERE "Category"."id" = "ProductVariant"."category_id")',
                );
            });
        });

        describe("embeddables", () => {
            it("resolves a field in an embeddable", () => {
                expect(callResolveFieldToSql("addressAsEmbeddable.street", "Manufacturer")).toBe('"Manufacturer"."address_as_embeddable_street"');
            });

            it("resolves a field in a nested embeddable", () => {
                expect(callResolveFieldToSql("addressAsEmbeddable.alternativeAddress.street", "Manufacturer")).toBe(
                    '"Manufacturer"."address_as_embeddable_alternative_address_street"',
                );
            });

            it("throws for a non-existent field in an embeddable", () => {
                expect(() => callResolveFieldToSql("addressAsEmbeddable.nonExistent", "Manufacturer")).toThrow(
                    'Embedded field "nonExistent" not found in embeddable "addressAsEmbeddable" of entity "Manufacturer"',
                );
            });

            it("throws for a non-existent field in a nested embeddable", () => {
                expect(() => callResolveFieldToSql("addressAsEmbeddable.alternativeAddress.nonExistent", "Manufacturer")).toThrow(
                    'Embedded field "nonExistent" not found in embeddable "alternativeAddress" of entity "Manufacturer"',
                );
            });
        });

        describe("relations combined with embeddables", () => {
            it("resolves a ManyToOne relation followed by an embeddable field", () => {
                expect(callResolveFieldToSql("product.manufacturer.addressAsEmbeddable.street", "ProductVariant")).toBe(
                    '(SELECT (SELECT "Manufacturer"."address_as_embeddable_street" FROM "Manufacturer" WHERE "Manufacturer"."id" = "Product"."manufacturer_id") FROM "Product" WHERE "Product"."id" = "ProductVariant"."product_id")',
                );
            });

            it("resolves a ManyToOne relation followed by a nested embeddable field", () => {
                expect(callResolveFieldToSql("product.manufacturer.addressAsEmbeddable.alternativeAddress.zip", "ProductVariant")).toBe(
                    '(SELECT (SELECT "Manufacturer"."address_as_embeddable_alternative_address_zip" FROM "Manufacturer" WHERE "Manufacturer"."id" = "Product"."manufacturer_id") FROM "Product" WHERE "Product"."id" = "ProductVariant"."product_id")',
                );
            });
        });

        describe("unsupported relation kinds", () => {
            it("throws for OneToMany relations", () => {
                expect(() => callResolveFieldToSql("tags.name", "ProductVariant")).toThrow(
                    'Only ManyToOne, OneToOne relations and embeddables are supported for EntityInfo. "tags" is "1:m"',
                );
            });
        });

        describe("missing target metadata", () => {
            it("throws when a relation has no target metadata", () => {
                const meta = {
                    className: "Broken",
                    tableName: "Broken",
                    primaryKeys: ["id"],
                    props: [{ name: "ref", kind: "m:1", fieldNames: ["ref_id"], joinColumns: ["ref_id"], targetMeta: undefined }],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                expect(() => (service as any).resolveFieldToSql("ref.name", meta, "Broken")).toThrow('Relation "ref" has no target metadata');
            });
        });
    });

    describe("resolveScopeToSql", () => {
        function callResolveScopeToSql(entityName: string): string {
            const metadata = orm.em.getMetadata().get(entityName);
            const entityClass = metadata.class;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (service as any).resolveScopeToSql(entityClass, metadata);
        }

        describe("direct scope embedded property", () => {
            it("builds JSON from embedded scope fields", () => {
                const result = callResolveScopeToSql("ScopedNews");
                expect(result).toBe(`jsonb_build_object('domain', "ScopedNews"."scope_domain", 'language', "ScopedNews"."scope_language")`);
            });
        });

        describe("entities without scope", () => {
            it("returns null::jsonb for entities with no scope and no @ScopedEntity", () => {
                const result = callResolveScopeToSql("Product");
                expect(result).toBe("null::jsonb");
            });
        });

        describe("@ScopedEntity with string path (relation -> embedded scope)", () => {
            it("resolves scope through a ManyToOne relation to an embedded scope", () => {
                const result = callResolveScopeToSql("ScopedComment");
                expect(result).toBe(
                    `(SELECT jsonb_build_object('domain', "ScopedNews"."scope_domain", 'language', "ScopedNews"."scope_language") FROM "ScopedNews" WHERE "ScopedNews"."id" = "ScopedComment"."news_id")`,
                );
            });
        });

        describe("@ScopedEntity with object path", () => {
            it("resolves individual scope fields through relation paths", () => {
                const result = callResolveScopeToSql("ScopedTask");
                expect(result).toBe(
                    `jsonb_build_object('domain', (SELECT "Company"."scope_domain" FROM "Company" WHERE "Company"."id" = "ScopedTask"."company_id"), 'language', (SELECT "Company"."scope_language" FROM "Company" WHERE "Company"."id" = "ScopedTask"."company_id"))`,
                );
            });
        });
    });
});
