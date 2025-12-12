import { CrudGenerator, CrudGeneratorHooksService, CurrentUser } from "@comet/cms-api";
import { BaseEntity, defineConfig, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { findHooksService } from "../find-hooks-service";
import { testPermission } from "../test-helper";

class TestEntityService implements CrudGeneratorHooksService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async validateCreateInput(input: any, options: { currentUser: CurrentUser; args: { xxx: string } }): Promise<void> {
        // no-op
    }
}

@Entity()
@CrudGenerator({
    targetDirectory: __dirname,
    requiredPermission: testPermission,
    hooksService: TestEntityService,
})
export class TestEntity extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    foo: string;
}

describe("find-hooks-service", () => {
    it("finds hooks service and defined methods", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity],
            }),
        );

        const hooksService = findHooksService({
            generatorOptions: { targetDirectory: __dirname, requiredPermission: testPermission, hooksService: TestEntityService },
            metadata: orm.em.getMetadata().get("TestEntity"),
        });
        if (!hooksService) throw new Error("hooksService not found");
        expect(hooksService.className).toEqual("TestEntityService");
        expect(hooksService.imports).toEqual([]);
        expect(hooksService.validateCreateInput).toBeDefined();
        expect(hooksService.validateCreateInput?.options).toContain("currentUser");
        expect(hooksService.validateCreateInput?.options).toContain("args");
        expect(hooksService.validateUpdateInput).toBeNull();

        await orm.close();
    });
});
