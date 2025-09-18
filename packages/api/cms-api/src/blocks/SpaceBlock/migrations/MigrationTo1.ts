import { BlockMigration } from "../../migrations/BlockMigration.js";
import { type BlockMigrationInterface } from "../../migrations/types.js";

interface From {
    height: number;
}

interface To {
    height: number;
    heigthSm: number;
}

export class MigrationTo1 extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
    public readonly toVersion = 1;

    protected migrate(from: From): To {
        return {
            ...from,
            heigthSm: from.height,
        };
    }
}
