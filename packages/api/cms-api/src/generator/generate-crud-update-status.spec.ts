import { BaseEntity, Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { Field, registerEnumType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

export enum TestEntitiyStatus {
    // Published = "Published",
    // Unpublished = "Unpublished",
    Active = "Active",
    Archived = "Archived",
    Deleted = "Deleted",
}

registerEnumType(TestEntitiyStatus, { name: "TestEntitiyStatus" });

@Entity()
class TestEntity extends BaseEntity<TestEntity, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @Enum({ items: () => TestEntitiyStatus })
    @Field(() => TestEntitiyStatus)
    status: TestEntitiyStatus = TestEntitiyStatus.Active;
}

describe("GenerateCrud Status", () => {
    it("should be a valid generated ts file", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [TestEntity],
        });

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity"));
        const lintedOut = await lintGeneratedFiles(out);

        {
            const file = lintedOut.find((file) => file.name === "dto/test-entity.input.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(2); //update + create

            const cls = classes[0];
            expect(cls.getName()).toBe("TestEntityInput");
            const structure = cls.getStructure();

            const propNames = (structure.properties || []).map((prop) => prop.name);

            expect(propNames).toEqual(["title"]); //status is not part of input dto
        }

        {
            const file = lintedOut.find((file) => file.name === "test-entity.resolver.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(1);

            const cls = classes[0];
            expect(cls.getName()).toBe("TestEntityResolver");
            const structure = cls.getStructure();

            const mathodNames = (structure.methods || []).map((method) => method.name);

            expect(mathodNames).toContain("updateTestEntityStatus");
        }
        orm.close();
    });
});
