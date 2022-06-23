import { NestFactory } from "@nestjs/core";
import { Field, GraphQLSchemaBuilderModule, GraphQLSchemaFactory, ObjectType, registerEnumType } from "@nestjs/graphql";
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
} from "./src";

export enum ExamplePageTreeNodeCategory {
    MainNavigation = "main-navigation",
    Other = "other",
}

registerEnumType(ExamplePageTreeNodeCategory, { name: "PageTreeNodeCategory" });

@ObjectType()
class PageTreeNode extends PageTreeNodeBase {
    @Field(() => ExamplePageTreeNodeCategory)
    category: ExamplePageTreeNodeCategory;
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
        Category: ExamplePageTreeNodeCategory,
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
