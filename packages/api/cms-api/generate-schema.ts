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
    DependenciesResolverFactory,
    DependentsResolverFactory,
    DocumentInterface,
    FileImagesResolver,
    InternalLinkBlock,
    PageTreeNodeBase,
    PageTreeNodeCategory,
} from "./src";
import { BuildTemplatesResolver } from "./src/builds/build-templates.resolver";
import { CronJobsResolver } from "./src/cron-jobs/cron-jobs.resolver";
import { JobsResolver } from "./src/cron-jobs/jobs.resolver";
import { createDamItemsResolver } from "./src/dam/files/dam-items.resolver";
import { createFileEntity } from "./src/dam/files/entities/file.entity";
import { createFolderEntity } from "./src/dam/files/entities/folder.entity";
import { FileLicensesResolver } from "./src/dam/files/file-licenses.resolver";
import { createFilesResolver } from "./src/dam/files/files.resolver";
import { createFoldersResolver } from "./src/dam/files/folders.resolver";
import { RedirectInputFactory } from "./src/redirects/dto/redirect-input.factory";
import { RedirectEntityFactory } from "./src/redirects/entities/redirect-entity.factory";
import { CurrentUser } from "./src/user-permissions/dto/current-user";
import { UserResolver } from "./src/user-permissions/user.resolver";
import { UserContentScopesResolver } from "./src/user-permissions/user-content-scopes.resolver";
import { UserPermissionResolver } from "./src/user-permissions/user-permission.resolver";

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
    const PageTreeDependentsResolver = DependentsResolverFactory.create(PageTreeNode);

    const AuthResolver = createAuthResolver({ currentUser: CurrentUser });
    const RedirectsDependenciesResolver = DependenciesResolverFactory.create(RedirectEntity);

    const Folder = createFolderEntity();
    const File = createFileEntity({ Folder });
    const FileDependentsResolver = DependentsResolverFactory.create(File);

    const schema = await gqlSchemaFactory.create([
        BuildsResolver,
        BuildTemplatesResolver,
        redirectsResolver,
        createDamItemsResolver({ File, Folder }),
        createFilesResolver({ File }),
        FileLicensesResolver,
        FileImagesResolver,
        createFoldersResolver({ Folder }),
        pageTreeResolver,
        CronJobsResolver,
        JobsResolver,
        AuthResolver,
        RedirectsDependenciesResolver,
        PageTreeDependentsResolver,
        FileDependentsResolver,
        UserResolver,
        UserPermissionResolver,
        UserContentScopesResolver,
    ]);

    await writeFile("schema.gql", printSchema(schema));

    console.log("Done!");
}

generateSchema();
