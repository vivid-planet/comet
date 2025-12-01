import { BaseEntity, defineConfig, Entity, MikroORM, PrimaryKey } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { buildSortProps } from "../build-options";

@Entity()
export class TestEntity1 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();
}

@Entity()
export class TestEntity2 extends BaseEntity {
    @PrimaryKey({ columnType: "uuid" })
    id: string = uuid();
}

describe("sort by id", () => {
    it("id should always be sortField", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity1],
            }),
        );

        const sortProps = buildSortProps(orm.em.getMetadata().get("TestEntity1"));
        expect(sortProps).toEqual(["id"]);

        await orm.close();
    });

    it("id should be sortField when using columnType", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity2],
            }),
        );

        const sortProps = buildSortProps(orm.em.getMetadata().get("TestEntity2"));
        expect(sortProps).toEqual(["id"]);
        await orm.close();
    });
});
