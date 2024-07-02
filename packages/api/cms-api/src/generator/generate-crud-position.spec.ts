import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int } from "@nestjs/graphql";
import { Min } from "class-validator";
import { v4 as uuid } from "uuid";

@Entity()
class TestEntityWithPositionField extends BaseEntity<TestEntityWithPositionField, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ columnType: "integer" })
    @Field(() => Int)
    @Min(1)
    position: number;
}

describe("GenerateCrudPosition", () => {
    it("should call update positions function", async () => {
        // LazyMetadataStorage.load();
        // const orm = await MikroORM.init({
        //     type: "postgresql",
        //     dbName: "test-db",
        //     entities: [TestEntityArrayString],
        // });
        //
        // const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityArrayString"));
        // const lintedOutput = await lintSource(out[0].content);
        // const source = parseSource(lintedOutput);
        //
        // const classes = source.getClasses();
        // expect(classes.length).toBe(2);
        //
        // {
        //     const cls = classes[0];
        //     const structure = cls.getStructure();
        //
        //     expect(structure.properties?.length).toBe(5);
        //     expect(structure.properties?.[0].name).toBe("test1");
        //     expect(structure.properties?.[0].type).toBe("string[]");
        //     expect(structure.properties?.[1].name).toBe("test2");
        //     expect(structure.properties?.[1].type).toBe("string[]");
        //     expect(structure.properties?.[2].name).toBe("test3");
        //     expect(structure.properties?.[2].type).toBe("string[]");
        //     expect(structure.properties?.[3].name).toBe("test4");
        //     expect(structure.properties?.[3].type).toBe("string[]");
        //     expect(structure.properties?.[4].name).toBe("test5");
        //     expect(structure.properties?.[4].type).toBe("string[]");
        // }
        //
        // orm.close();
    });
    it("should generate create and update with optional position field", async () => {});

    it("should handle create with set position by calling 'update positions function'", async () => {});
    it("should handle create without set position by calculating", async () => {});
    it("should update position fields for other entities on delete", async () => {});
    // TODO add util/helper function to update positions, this could be unit-tested.
    // TODO versuchen das ganze über nicht generierte funktionen zu lösen, die können wir unit testen.
});
