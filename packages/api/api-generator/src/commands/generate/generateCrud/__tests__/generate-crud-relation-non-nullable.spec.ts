import { BaseEntity, Cascade, defineConfig, Entity, ManyToOne, MikroORM, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { Field } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { formatGeneratedFiles, parseSource, testPermission } from "../../utils/test-helper";
import { generateCrud } from "../generate-crud";

@Entity()
class Product extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    name: string;
}

@Entity()
class ProductVariant extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    name: string;

    @Field(() => Product)
    @ManyToOne(() => Product, { ref: true })
    productRelationWithoutCascade: Ref<Product>;

    @Field(() => Product)
    @ManyToOne(() => Product, { cascade: [Cascade.REMOVE], ref: true })
    productRelationWithCascade: Ref<Product>;
}

describe("GenerateCrudRelationNonNullable", () => {
    it("should generate non-nullable validators for ManyToOne relations regardless of cascade option", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [Product, ProductVariant],
            }),
        );

        const out = await generateCrud(
            { targetDirectory: __dirname, requiredPermission: testPermission },
            orm.em.getMetadata().get("ProductVariant"),
        );
        const formattedOut = await formatGeneratedFiles(out);
        const inputFile = formattedOut.find((file) => file.name === "dto/product-variant.input.ts");
        if (!inputFile) throw new Error("Input file not found");

        const source = parseSource(inputFile.content);
        const classes = source.getClasses();
        const structure = classes[0].getStructure();

        const propertyWithoutCascade = structure.properties?.find((prop) => prop.name === "productRelationWithoutCascade");
        const decoratorsWithoutCascade = propertyWithoutCascade?.decorators?.map((dec) => dec.name);
        expect(propertyWithoutCascade?.hasQuestionToken).toBe(false);
        expect(decoratorsWithoutCascade).toContain("IsNotEmpty");
        expect(decoratorsWithoutCascade).not.toContain("IsNullable");

        const propertyWithCascade = structure.properties?.find((prop) => prop.name === "productRelationWithCascade");
        const decoratorsWithCascade = propertyWithCascade?.decorators?.map((dec) => dec.name);
        expect(propertyWithCascade?.hasQuestionToken).toBe(false);
        expect(decoratorsWithCascade).toContain("IsNotEmpty");
        expect(decoratorsWithCascade).not.toContain("IsNullable");

        await orm.close();
    });
});
