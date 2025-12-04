import { BaseEntity, defineConfig, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { formatGeneratedFiles, testPermission } from "../../utils/test-helper";
import { generateCrud } from "../generate-crud";

@Entity()
export class TestEntity extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ columnType: "text" })
    title: string;

    @Property()
    visible: boolean;
}

describe("request-context-visibility", () => {
    it("resolver should include requestContextVisibilityFilter visible", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity],
            }),
        );

        const out = await generateCrud(
            { targetDirectory: __dirname, requiredPermission: testPermission, requestContextVisibilityFilter: { visible: true } },
            orm.em.getMetadata().get("TestEntity"),
        );
        const lintedOut = await formatGeneratedFiles(out);

        const file = lintedOut.find((file) => file.name === "test-entity.resolver.ts");
        if (!file) throw new Error("File not found");

        expect(file.content).toMatchSnapshot();

        await orm.close();
    });
    it("resolver should include requestContextVisibilityFilter visible", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity],
            }),
        );

        const out = await generateCrud(
            { targetDirectory: __dirname, requiredPermission: testPermission, requestContextVisibilityFilter: { title: { $ne: "example" } } },
            orm.em.getMetadata().get("TestEntity"),
        );
        const lintedOut = await formatGeneratedFiles(out);

        const file = lintedOut.find((file) => file.name === "test-entity.resolver.ts");
        if (!file) throw new Error("File not found");

        expect(file.content).toMatchSnapshot();

        await orm.close();
    });
});
