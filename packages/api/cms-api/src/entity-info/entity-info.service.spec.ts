import { ReferenceKind } from "@mikro-orm/core";
import { type EntityMetadata, type EntityProperty } from "@mikro-orm/postgresql";

import { EntityInfoService } from "./entity-info.service";

function createMetadata(overrides: Partial<EntityMetadata>): EntityMetadata {
    return { className: "TestEntity", tableName: "TestEntity", props: [], primaryKeys: ["id"], ...overrides } as EntityMetadata;
}

function createProp(overrides: Partial<EntityProperty>): EntityProperty {
    return { fieldNames: [], ...overrides } as EntityProperty;
}

// ProductVariant --m:1--> Product --m:1--> Manufacturer (has @Embedded AddressAsEmbeddable)
// AddressAsEmbeddable has @Embedded AlternativeAddressAsEmbeddable

const alternativeAddressProps: Record<string, EntityProperty> = {
    street: createProp({ name: "street", kind: ReferenceKind.SCALAR, fieldNames: ["address_as_embeddable_alternative_address_street"] }),
    zip: createProp({ name: "zip", kind: ReferenceKind.SCALAR, fieldNames: ["address_as_embeddable_alternative_address_zip"] }),
};

const addressEmbeddedProps: Record<string, EntityProperty> = {
    street: createProp({ name: "street", kind: ReferenceKind.SCALAR, fieldNames: ["address_as_embeddable_street"] }),
    zip: createProp({ name: "zip", kind: ReferenceKind.SCALAR, fieldNames: ["address_as_embeddable_zip"] }),
    alternativeAddress: createProp({
        name: "alternativeAddress",
        kind: ReferenceKind.EMBEDDED,
        fieldNames: ["address_as_embeddable_alternative_address"],
        embeddedProps: alternativeAddressProps,
    }),
};

const manufacturerMeta = createMetadata({
    className: "Manufacturer",
    tableName: "Manufacturer",
    props: [
        createProp({ name: "id", kind: ReferenceKind.SCALAR, fieldNames: ["id"] }),
        createProp({ name: "name", kind: ReferenceKind.SCALAR, fieldNames: ["name"] }),
        createProp({
            name: "addressAsEmbeddable",
            kind: ReferenceKind.EMBEDDED,
            fieldNames: ["address_as_embeddable"],
            embeddedProps: addressEmbeddedProps,
        }),
    ],
});

const productMeta = createMetadata({
    className: "Product",
    tableName: "Product",
    primaryKeys: ["id"],
    props: [
        createProp({ name: "id", kind: ReferenceKind.SCALAR, fieldNames: ["id"] }),
        createProp({ name: "name", kind: ReferenceKind.SCALAR, fieldNames: ["name"] }),
        createProp({ name: "slug", kind: ReferenceKind.SCALAR, fieldNames: ["url_slug"] }),
        createProp({
            name: "manufacturer",
            kind: ReferenceKind.MANY_TO_ONE,
            fieldNames: ["manufacturer_id"],
            joinColumns: ["manufacturer_id"],
            targetMeta: manufacturerMeta,
        }),
    ],
});

const categoryMeta = createMetadata({
    className: "Category",
    tableName: "Category",
    primaryKeys: ["id"],
    props: [
        createProp({ name: "id", kind: ReferenceKind.SCALAR, fieldNames: ["id"] }),
        createProp({ name: "title", kind: ReferenceKind.SCALAR, fieldNames: ["title"] }),
        createProp({
            name: "parent",
            kind: ReferenceKind.ONE_TO_ONE,
            fieldNames: ["parent_id"],
            joinColumns: ["parent_id"],
            targetMeta: undefined, // set below (self-reference)
        }),
    ],
});
// Self-referencing OneToOne
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
categoryMeta.props.find((p) => p.name === "parent")!.targetMeta = categoryMeta;

const productVariantMeta = createMetadata({
    className: "ProductVariant",
    tableName: "ProductVariant",
    primaryKeys: ["id"],
    props: [
        createProp({ name: "id", kind: ReferenceKind.SCALAR, fieldNames: ["id"] }),
        createProp({ name: "name", kind: ReferenceKind.SCALAR, fieldNames: ["name"] }),
        createProp({
            name: "product",
            kind: ReferenceKind.MANY_TO_ONE,
            fieldNames: ["product_id"],
            joinColumns: ["product_id"],
            targetMeta: productMeta,
        }),
        createProp({
            name: "category",
            kind: ReferenceKind.ONE_TO_ONE,
            fieldNames: ["category_id"],
            joinColumns: ["category_id"],
            targetMeta: categoryMeta,
        }),
        createProp({
            name: "tags",
            kind: ReferenceKind.ONE_TO_MANY,
            fieldNames: [],
        }),
    ],
});

function callResolveFieldToSql(fieldPath: string, metadata: EntityMetadata, tableName: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new (EntityInfoService as any)({}, { getConnection: () => ({}) });
    return service.resolveFieldToSql(fieldPath, metadata, tableName);
}

describe("EntityInfoService", () => {
    describe("resolveFieldToSql", () => {
        describe("direct fields", () => {
            it("resolves a simple field to its column name", () => {
                expect(callResolveFieldToSql("name", productVariantMeta, "ProductVariant")).toBe('"ProductVariant"."name"');
            });

            it("resolves a field with a different column name", () => {
                expect(callResolveFieldToSql("slug", productMeta, "Product")).toBe('"Product"."url_slug"');
            });

            it("throws for a non-existent field", () => {
                expect(() => callResolveFieldToSql("nonExistent", productVariantMeta, "ProductVariant")).toThrow(
                    'Field "nonExistent" not found in entity "ProductVariant"',
                );
            });
        });

        describe("ManyToOne relations", () => {
            it("resolves a single-level ManyToOne relation", () => {
                expect(callResolveFieldToSql("product.name", productVariantMeta, "ProductVariant")).toBe(
                    '(SELECT "Product"."name" FROM "Product" WHERE "Product"."id" = "ProductVariant"."product_id")',
                );
            });

            it("resolves a two-level ManyToOne relation chain", () => {
                expect(callResolveFieldToSql("product.manufacturer.name", productVariantMeta, "ProductVariant")).toBe(
                    '(SELECT (SELECT "Manufacturer"."name" FROM "Manufacturer" WHERE "Manufacturer"."id" = "Product"."manufacturer_id") FROM "Product" WHERE "Product"."id" = "ProductVariant"."product_id")',
                );
            });
        });

        describe("OneToOne relations", () => {
            it("resolves a single-level OneToOne relation", () => {
                expect(callResolveFieldToSql("category.title", productVariantMeta, "ProductVariant")).toBe(
                    '(SELECT "Category"."title" FROM "Category" WHERE "Category"."id" = "ProductVariant"."category_id")',
                );
            });

            it("resolves a self-referencing OneToOne relation (n-level)", () => {
                expect(callResolveFieldToSql("category.parent.title", productVariantMeta, "ProductVariant")).toBe(
                    '(SELECT (SELECT "Category"."title" FROM "Category" WHERE "Category"."id" = "Category"."parent_id") FROM "Category" WHERE "Category"."id" = "ProductVariant"."category_id")',
                );
            });
        });

        describe("embeddables", () => {
            it("resolves a field in an embeddable", () => {
                expect(callResolveFieldToSql("addressAsEmbeddable.street", manufacturerMeta, "Manufacturer")).toBe(
                    '"Manufacturer"."address_as_embeddable_street"',
                );
            });

            it("resolves a field in a nested embeddable", () => {
                expect(callResolveFieldToSql("addressAsEmbeddable.alternativeAddress.street", manufacturerMeta, "Manufacturer")).toBe(
                    '"Manufacturer"."address_as_embeddable_alternative_address_street"',
                );
            });

            it("throws for a non-existent field in an embeddable", () => {
                expect(() => callResolveFieldToSql("addressAsEmbeddable.nonExistent", manufacturerMeta, "Manufacturer")).toThrow(
                    'Embedded field "nonExistent" not found in embeddable "addressAsEmbeddable"',
                );
            });

            it("throws for a non-existent field in a nested embeddable", () => {
                expect(() => callResolveFieldToSql("addressAsEmbeddable.alternativeAddress.nonExistent", manufacturerMeta, "Manufacturer")).toThrow(
                    'Embedded field "nonExistent" not found in embeddable "alternativeAddress"',
                );
            });
        });

        describe("relations combined with embeddables", () => {
            it("resolves a ManyToOne relation followed by an embeddable field", () => {
                expect(callResolveFieldToSql("product.manufacturer.addressAsEmbeddable.street", productVariantMeta, "ProductVariant")).toBe(
                    '(SELECT (SELECT "Manufacturer"."address_as_embeddable_street" FROM "Manufacturer" WHERE "Manufacturer"."id" = "Product"."manufacturer_id") FROM "Product" WHERE "Product"."id" = "ProductVariant"."product_id")',
                );
            });

            it("resolves a ManyToOne relation followed by a nested embeddable field", () => {
                expect(
                    callResolveFieldToSql("product.manufacturer.addressAsEmbeddable.alternativeAddress.zip", productVariantMeta, "ProductVariant"),
                ).toBe(
                    '(SELECT (SELECT "Manufacturer"."address_as_embeddable_alternative_address_zip" FROM "Manufacturer" WHERE "Manufacturer"."id" = "Product"."manufacturer_id") FROM "Product" WHERE "Product"."id" = "ProductVariant"."product_id")',
                );
            });
        });

        describe("unsupported relation kinds", () => {
            it("throws for OneToMany relations", () => {
                expect(() => callResolveFieldToSql("tags.name", productVariantMeta, "ProductVariant")).toThrow(
                    'Only ManyToOne, OneToOne relations and embeddables are supported for EntityInfo. "tags" is "1:m"',
                );
            });
        });

        describe("missing target metadata", () => {
            it("throws when a relation has no target metadata", () => {
                const meta = createMetadata({
                    className: "Broken",
                    tableName: "Broken",
                    props: [
                        createProp({
                            name: "ref",
                            kind: ReferenceKind.MANY_TO_ONE,
                            fieldNames: ["ref_id"],
                            joinColumns: ["ref_id"],
                            targetMeta: undefined,
                        }),
                    ],
                });
                expect(() => callResolveFieldToSql("ref.name", meta, "Broken")).toThrow('Relation "ref" has no target metadata');
            });
        });
    });
});
