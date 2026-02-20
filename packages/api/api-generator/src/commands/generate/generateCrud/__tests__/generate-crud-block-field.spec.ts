import { Block, ExtractBlockInput, RootBlock } from "@comet/cms-api";
import { BaseEntity, defineConfig, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { formatGeneratedFiles, parseSource, testPermission } from "../../utils/test-helper";
import { generateCrud } from "../generate-crud";

export const TestBlock: Block = {
    name: "TestBlock",
    blockDataFactory: jest.fn(),
    blockInputFactory: jest.fn(),
    blockMeta: { fields: [] },
    blockInputMeta: { fields: [] },
};

@Entity()
class TestEntityWithBlock extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "text" })
    title: string;

    @RootBlock(TestBlock)
    @Property({ type: "RootBlockType" })
    content: ExtractBlockInput<typeof TestBlock>;
}

describe("GenerateCrudBlockField", () => {
    it("should generate correct input and resolver for block fields", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntityWithBlock],
            }),
        );

        const out = await generateCrud(
            { targetDirectory: __dirname, requiredPermission: testPermission },
            orm.em.getMetadata().get("TestEntityWithBlock"),
        );
        const formattedOut = await formatGeneratedFiles(out);

        const inputFile = formattedOut.find((file) => file.name === "dto/test-entity-with-block.input.ts");
        if (!inputFile) throw new Error("Input file not found");

        const inputSource = parseSource(inputFile.content);
        const inputClasses = inputSource.getClasses();
        expect(inputClasses.length).toBe(2);

        const inputClass = inputClasses[0];
        expect(inputClass.getName()).toBe("TestEntityWithBlockInput");

        expect(inputClass.getText()).toMatchSnapshot("TestEntityWithBlockInput");

        expect(inputFile.content).toContain("ExtractBlockInput<typeof TestBlock>");
        expect(inputFile.content).toContain("@Field(() => RootBlockInputScalar(TestBlock))");
        expect(inputFile.content).toContain(
            "@Transform(({ value }) => (isBlockInputInterface(value) ? value : TestBlock.blockInputFactory(value)), { toClassOnly: true })",
        );
        expect(inputFile.content).toContain("@ValidateNested()");

        expect(inputFile.content).toContain("ExtractBlockInput");
        expect(inputFile.content).toContain("RootBlockInputScalar");
        expect(inputFile.content).toContain("isBlockInputInterface");

        const resolverFile = formattedOut.find((file) => file.name === "test-entity-with-block.resolver.ts");
        if (!resolverFile) throw new Error("Resolver file not found");

        expect(resolverFile.content).toContain("content: TestBlock.blockDataFactory(contentInput.toPlain())");

        expect(resolverFile.content).toContain("testEntityWithBlock.content = TestBlock.blockDataFactory(contentInput.toPlain())");

        expect(resolverFile.content).toContain("TestBlock");

        const resolverSource = parseSource(resolverFile.content);
        const resolverClasses = resolverSource.getClasses();
        const resolverClass = resolverClasses.find((cls) => cls.getName() === "TestEntityWithBlockResolver");
        expect(resolverClass?.getText()).toMatchSnapshot("TestEntityWithBlockResolver");

        await orm.close();
    });
});
