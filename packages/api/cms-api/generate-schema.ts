import { createOneOfBlock, ExternalLinkBlock } from "@comet/blocks-api";
import { NestFactory } from "@nestjs/core";
import { Field, GraphQLSchemaBuilderModule, GraphQLSchemaFactory, ObjectType } from "@nestjs/graphql";
import { writeFile } from "fs/promises";
import { printSchema } from "graphql";

import {
    BuildsResolver,
    createAuthResolver,
    createPageTreeResolver,
    createRedirectsResolver,
    CurrentUserInterface,
    CurrentUserRightInterface,
    DocumentInterface,
    FileImagesResolver,
    FilesResolver,
    FoldersResolver,
    InternalLinkBlock,
    PageTreeNodeBase,
    PageTreeNodeCategory,
} from "./src";
import { BuildTemplatesResolver } from "./src/builds/build-templates.resolver";
import { DamItemsResolver } from "./src/dam/files/dam-items.resolver";
import { RedirectInputFactory } from "./src/redirects/dto/redirect-input.factory";
import { RedirectEntityFactory } from "./src/redirects/entities/redirect-entity.factory";

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

@ObjectType()
class CurrentUserRight implements CurrentUserRightInterface {
    @Field()
    right: string;

    @Field(() => [String])
    values: string[];
}

@ObjectType()
class CurrentUser implements CurrentUserInterface {
    id: string;
    @Field()
    name: string;
    @Field()
    email: string;
    @Field()
    language: string;
    @Field()
    role: string;
    @Field(() => [CurrentUserRight], { nullable: true })
    rights: CurrentUserRightInterface[];
}

async function generateSchema(): Promise<void> {
    console.info("Generating schema.gql...");

    const app = await NestFactory.create(GraphQLSchemaBuilderModule);
    await app.init();

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory);

    const linkBlock = createOneOfBlock(
        { supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock }, allowEmpty: false },
        "RedirectsLink",
    );
    const RedirectEntity = RedirectEntityFactory.create({ linkBlock });
    const RedirectInput = RedirectInputFactory.create({ linkBlock });

    const redirectsResolver = createRedirectsResolver({ Redirect: RedirectEntity, RedirectInput });
    const pageTreeResolver = createPageTreeResolver({
        PageTreeNode,
        Documents: [Page],
    }); // no scope
    const AuthResolver = createAuthResolver({ currentUser: CurrentUser });

    const schema = await gqlSchemaFactory.create([
        BuildsResolver,
        BuildTemplatesResolver,
        redirectsResolver,
        FilesResolver,
        FileImagesResolver,
        FoldersResolver,
        pageTreeResolver,
        DamItemsResolver,
        AuthResolver,
    ]);

    await writeFile("schema.gql", printSchema(schema));

    console.log("Done!");
}

generateSchema();
