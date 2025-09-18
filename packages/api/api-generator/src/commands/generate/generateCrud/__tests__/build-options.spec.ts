import { BaseEntity, defineConfig, Entity, ManyToOne, MikroORM, OneToOne, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { testPermission } from "../../utils/test-helper";
import { buildSortProps } from "../build-options";
import { generateSortDto } from "../generate-crud";

@Entity()
export class TestEntity1 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    foo: string;
}

@Entity()
export class TestEntity2 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => TestEntityTarget, { nullable: true, index: true, ref: true })
    nested?: Ref<TestEntityTarget> = undefined;
}

@Entity()
export class TestEntity3 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToOne(() => TestEntityTarget, { nullable: true, index: true, ref: true })
    nested?: Ref<TestEntityTarget> = undefined;
}

@Entity()
export class TestEntityTarget extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    foo: string;
}

describe("buildOptions", () => {
    describe("buildSortProps", () => {
        it("string field should be used as sortProp", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    connect: false,
                    entities: [TestEntity1],
                }),
            );

            const sortProps = buildSortProps(orm.em.getMetadata().get("TestEntity1"));
            expect(sortProps).toEqual(["foo"]);

            await orm.close();
        });

        it("nested m:1 relation string field should be used as sortProp", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    connect: false,
                    entities: [TestEntity2, TestEntityTarget],
                }),
            );

            const metadata = orm.em.getMetadata().get("TestEntity2");

            const sortProps = buildSortProps(metadata);
            expect(sortProps).toEqual(["nested", "nested.foo"]);

            const sortDto = generateSortDto({ generatorOptions: { targetDirectory: __dirname, requiredPermission: testPermission }, metadata });
            expect(sortDto).toMatchSnapshot();

            await orm.close();
        });

        it("nested 1:1 relation string field should be used as sortProp", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    connect: false,
                    entities: [TestEntity3, TestEntityTarget],
                }),
            );

            const sortProps = buildSortProps(orm.em.getMetadata().get("TestEntity3"));
            expect(sortProps).toEqual(["nested.foo"]);

            await orm.close();
        });
    });
});
