import { BaseEntity, Embeddable, Embedded, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/postgresql";
import { Field, Int } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { Min } from "class-validator";
import { v4 as uuid } from "uuid";

import { CrudGenerator } from "./crud-generator.decorator";
import { generateCrud } from "./generate-crud";
import { generateCrudInput } from "./generate-crud-input";
import { lintSource, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityWithPositionField extends BaseEntity<TestEntityWithPositionField, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ columnType: "integer" })
    @Field(() => Int)
    @Min(1)
    position: number;
}

@Embeddable()
export class TestEntityScope {
    @Property({ columnType: "text" })
    language: string;
}
@Entity()
class TestEntityWithPositionFieldAndScope extends BaseEntity<TestEntityWithPositionFieldAndScope, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ columnType: "integer" })
    @Field(() => Int)
    @Min(1)
    position: number;

    @Embedded(() => TestEntityScope)
    scope: TestEntityScope;
}

@Entity()
@CrudGenerator({ targetDirectory: __dirname, position: { groupByFields: ["country"] } })
class TestEntityWithPositionGroup extends BaseEntity<TestEntityWithPositionGroup, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ columnType: "integer" })
    @Field(() => Int)
    @Min(1)
    position: number;

    @Property()
    country: string;
}

describe("GenerateCrudPosition", () => {
    it("input should contain optional position with Int and Min(1)", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntityWithPositionField],
            }),
        );

        const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithPositionField"));
        const lintedOutput = await lintSource(out[0].content);
        const source = parseSource(lintedOutput);

        const classes = source.getClasses();
        expect(classes.length).toBe(2);

        {
            const cls = classes[0];
            const structure = cls.getStructure();

            expect(structure.properties?.length).toBe(1);
            expect(structure.properties?.[0].name).toBe("position");
            expect(structure.properties?.[0].type).toBe("number");
            expect(structure.properties?.[0].decorators?.map((decorator) => decorator.name)).toContain("IsInt");
            expect(structure.properties?.[0].decorators?.map((decorator) => decorator.name)).toContain("IsOptional");

            const fieldDecorator = structure.properties?.[0].decorators?.find((i) => i.name === "Field");
            expect(fieldDecorator).not.toBeUndefined();
            expect(fieldDecorator?.arguments).toContain("() => Int");
            expect(fieldDecorator?.arguments).toContain("{ nullable: true }");

            const minDecorator = structure.properties?.[0].decorators?.find((i) => i.name === "Min");
            expect(minDecorator).not.toBeUndefined();
            expect(minDecorator?.arguments).toContain("1");
        }

        orm.close();
    });
    it("service should implement position-functions", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntityWithPositionField],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithPositionField"));
        const file = out.find((file) => file.name == "test-entity-with-position-fields.service.ts");
        if (!file) throw new Error("File not found");

        const lintedOutput = await lintSource(file.content);
        const source = parseSource(lintedOutput);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        {
            const cls = classes[0];
            const structure = cls.getStructure();

            const incrementPositionsFunction = structure.methods?.find((method) => method.name === "incrementPositions");
            expect(incrementPositionsFunction).not.toBeUndefined();

            const decrementPositionsFunction = structure.methods?.find((method) => method.name === "decrementPositions");
            expect(decrementPositionsFunction).not.toBeUndefined();

            const getLastPositionFunction = structure.methods?.find((method) => method.name === "getLastPosition");
            expect(getLastPositionFunction).not.toBeUndefined();
        }

        orm.close();
    });
    it("service should implement getPositionGroupCondition-function if scope existent", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntityWithPositionFieldAndScope, TestEntityWithPositionGroup],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithPositionFieldAndScope"));
        const file = out.find((file) => file.name == "test-entity-with-position-field-and-scopes.service.ts");
        if (!file) throw new Error("File not found");

        const lintedOutput = await lintSource(file.content);
        const source = parseSource(lintedOutput);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        {
            const cls = classes[0];
            const structure = cls.getStructure();

            const getLastPositionFunction = structure.methods?.find((method) => method.name === "getPositionGroupCondition");
            expect(getLastPositionFunction).not.toBeUndefined();
        }

        orm.close();
    });
    it("service should implement getPositionGroupCondition-function if configured", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntityWithPositionGroup],
            }),
        );

        const out = await generateCrud(
            { targetDirectory: __dirname, position: { groupByFields: ["country"] } },
            orm.em.getMetadata().get("TestEntityWithPositionGroup"),
        );
        const file = out.find((file) => file.name == "test-entity-with-position-groups.service.ts");
        if (!file) throw new Error("File not found");

        const lintedOutput = await lintSource(file.content);
        const source = parseSource(lintedOutput);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        {
            const cls = classes[0];
            const structure = cls.getStructure();

            const getLastPositionFunction = structure.methods?.find((method) => method.name === "getPositionGroupCondition");
            expect(getLastPositionFunction).not.toBeUndefined();
        }

        orm.close();
    });
});
