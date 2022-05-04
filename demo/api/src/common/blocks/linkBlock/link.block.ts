import { createOneOfBlock, ExternalLinkBlock, InternalLinkBlock, typesafeMigrationPipe } from "@comet/blocks-api";

import { RemoveEmptyOptionMigration } from "./migrations/1-remove-empy-option.migration";

export const LinkBlock = createOneOfBlock(
    { supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock }, allowEmpty: false },
    {
        name: "Link",
        migrate: { version: 1, migrations: typesafeMigrationPipe([RemoveEmptyOptionMigration]) },
    },
);
