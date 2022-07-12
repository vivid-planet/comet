import { NestFactory } from "@nestjs/core";
import { Field, GraphQLSchemaBuilderModule, GraphQLSchemaFactory, ObjectType } from "@nestjs/graphql";
import { writeFile } from "fs/promises";
import { printSchema } from "graphql";

import {
    BuildsResolver,
    createPageTreeResolver,
    createRedirectsResolver,
    DocumentInterface,
    FileImagesResolver,
    FilesResolver,
    FoldersResolver,
    PageTreeNodeBase,
    PageTreeNodeCategory,
} from "./src";

@ObjectType()
class PageTreeNode extends PageTreeNodeBase {
    @Field(() => String)
    category: PageTreeNodeCategory;
}

@ObjectType({
    implements: () => [DocumentInterface],
})
class Page implements DocumentInterface {
    id: string;
    updatedAt: Date;
}

async function generateSchema(): Promise<void> {
    console.info("Generating schema.gql...");

    const app = await NestFactory.create(GraphQLSchemaBuilderModule);
    await app.init();

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory);

    const redirectsResolver = createRedirectsResolver(PageTreeNode);
    const pageTreeResolver = createPageTreeResolver({
        PageTreeNode,
        Documents: [Page],
    }); // no scope

    const schema = await gqlSchemaFactory.create([
        BuildsResolver,
        redirectsResolver,
        FilesResolver,
        FileImagesResolver,
        FoldersResolver,
        pageTreeResolver,
    ]);

    await writeFile("schema.gql", printSchema(schema));

    console.log("Done!");
}

generateSchema();
