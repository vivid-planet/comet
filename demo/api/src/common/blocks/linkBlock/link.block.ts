import { createOneOfBlock, ExternalLinkBlock, typesafeMigrationPipe } from "@comet/blocks-api";
import { InternalLinkBlock } from "@comet/cms-api";
import { NewsLinkBlock } from "@src/news/blocks/news-link.block";

import { RemoveEmptyOptionMigration } from "./migrations/1-remove-empy-option.migration";

export const LinkBlock = createOneOfBlock(
    { supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, news: NewsLinkBlock }, allowEmpty: false },
    {
        name: "Link",
        migrate: { version: 1, migrations: typesafeMigrationPipe([RemoveEmptyOptionMigration]) },
    },
);
