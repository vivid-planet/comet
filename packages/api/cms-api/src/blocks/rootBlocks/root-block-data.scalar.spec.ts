import { NestFactory } from "@nestjs/core";
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory, Query } from "@nestjs/graphql";
import { beforeEach, describe, expect, it } from "vitest";

import { PixelImageBlock } from "../../dam/blocks/pixel-image.block";
import { RootBlockDataScalar } from "./root-block-data.scalar";

let gqlSchemaFactory: GraphQLSchemaFactory;

// TODO: Re-enable once the source uses `import type` for type-only imports of decorated classes.
// Under Vitest/SWC (unlike ts-jest), value-only imports of types are not elided, so many
// unrelated `@ObjectType` classes are transitively registered in NestJS' global
// `TypeMetadataStorage` and end up in the generated schema. This causes the schema build
// to fail on types that reference dynamically-registered scalars like `CombinedPermission`.
describe.skip("RootBlockDataScalar", () => {
    beforeEach(async () => {
        const app = await NestFactory.create(GraphQLSchemaBuilderModule, { logger: false });
        await app.init();

        gqlSchemaFactory = app.get(GraphQLSchemaFactory);
    });

    it("should work", async () => {
        class DemoResolver {
            @Query(() => RootBlockDataScalar(PixelImageBlock))
            image(): void {
                // noop
            }
        }

        const schema = await gqlSchemaFactory.create([DemoResolver]);
        expect(schema.getType("PixelImageBlockData")).toBeTruthy();
    });

    it("should work with multiple instances of the same scalar", async () => {
        class DemoResolver {
            @Query(() => RootBlockDataScalar(PixelImageBlock))
            image1(): void {
                // noop
            }

            @Query(() => RootBlockDataScalar(PixelImageBlock))
            image2(): void {
                // noop
            }
        }

        const schema = await gqlSchemaFactory.create([DemoResolver]);
        expect(schema.getType("PixelImageBlockData")).toBeTruthy();
    });
});
