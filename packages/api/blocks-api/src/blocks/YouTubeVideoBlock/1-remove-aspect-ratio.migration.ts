import { BlockMigration } from "src/migrations/BlockMigration";
import { BlockMigrationInterface } from "src/migrations/types";

/* eslint-disable @typescript-eslint/naming-convention */
enum AspectRatio {
    "16X9" = "16X9",
    "4X3" = "4X3",
}
/* eslint-enable @typescript-eslint/naming-convention */

interface From {
    youtubeIdentifier?: string;
    aspectRatio: AspectRatio;
    autoplay?: boolean;
    showControls?: boolean;
    loop?: boolean;
}

interface To {
    youtubeIdentifier?: string;
    autoplay?: boolean;
    showControls?: boolean;
    loop?: boolean;
}

export class RemoveAspectRatioMigration extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
    public readonly toVersion = 1;

    protected migrate({ aspectRatio, ...other }: From): To {
        return { ...other };
    }
}
