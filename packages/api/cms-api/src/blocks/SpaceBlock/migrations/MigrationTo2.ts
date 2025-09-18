import { BlockMigration } from "../../migrations/BlockMigration.js";
import { type BlockMigrationInterface } from "../../migrations/types.js";

interface From {
    height: number;
    heigthSm: number;
}

interface To {
    height: number;
}

export class MigrationTo2 extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
    public readonly toVersion = 2;

    protected migrate(from: From): To {
        const { heigthSm, ...to } = from;

        return to;
    }
}
