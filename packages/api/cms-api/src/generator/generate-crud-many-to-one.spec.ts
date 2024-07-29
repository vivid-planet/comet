import { BaseEntity, Collection, Entity, ManyToOne, MikroORM, OneToMany, PrimaryKey, Ref } from "@mikro-orm/core";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
export class Company extends BaseEntity<Company, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => Measure, (measure) => measure.company)
    measures = new Collection<Measure>(this);
}

@Entity()
export class Measure extends BaseEntity<Company, "id"> {
    @PrimaryKey({ columnType: "int", type: "int" })
    id: number;

    @ManyToOne(() => Company, { onDelete: "cascade", ref: true })
    company: Ref<Company>;
}

describe("GenerateCrud", () => {
    describe("test m:1 filter with int id", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [Company, Measure],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("Measure"));
            const lintedOut = await lintGeneratedFiles(out);

            const file = lintedOut.find((file) => file.name === "dto/measure.filter.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(1);

            const cls = classes[0];
            expect(cls.getName()).toBe("MeasureFilter");
            const structure = cls.getStructure();

            expect(structure.properties?.length).toBe(4);

            if (!structure.properties || !structure.properties[0]) throw new Error("property not found");
            const filterProp = structure.properties[1];
            expect(filterProp.name).toBe("company");
            expect(filterProp.type).toBe("ManyToOneIntFilter");

            orm.close();
        });
    });
});
