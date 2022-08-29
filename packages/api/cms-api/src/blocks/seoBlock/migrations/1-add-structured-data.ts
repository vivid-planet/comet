import { BlockMigration, BlockMigrationInterface } from "@comet/blocks-api";

interface From {
    htmlTitle: unknown;
    metaDescription: unknown;
    openGraphTitle: unknown;
    openGraphDescription: unknown;
    openGraphImage: unknown;
    noIndex: unknown;
    priority: unknown;
    changeFrequency: unknown;
}

interface To extends From {
    structuredData: unknown;
    structuredDataContent: unknown;
}

export class AddStructuredDataMigration extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
    public readonly toVersion = 1;

    protected migrate(from: From): To {
        return { ...from, structuredData: false, structuredDataContent: undefined };
    }
}
