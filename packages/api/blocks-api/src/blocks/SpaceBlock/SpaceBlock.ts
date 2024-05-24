import { IsInt, Max } from "class-validator";

// import { typesafeMigrationPipe } from "../../migrations/typesafeMigrationPipe";
import { BlockData, BlockInput, createBlock, inputToData } from "../block";
import { BlockField } from "../decorators/field";
// import { MigrationTo1 } from "./migrations/MigrationTo1";
// import { MigrationTo2 } from "./migrations/MigrationTo2";

class SpaceBlockData extends BlockData {
    @BlockField()
    height: number;
}

class SpaceBlockInput extends BlockInput {
    @Max(1000)
    @IsInt()
    @BlockField()
    height: number;

    transformToBlockData(): SpaceBlockData {
        return inputToData(SpaceBlockData, this);
    }
}

/** @deprecated The `SpaceBlock` is deprecated. It will be removed in the next major version. Use `createSpaceBlock` instead. */
export const SpaceBlock = createBlock(SpaceBlockData, SpaceBlockInput, {
    name: "Space",
    // demoMigrations:
    // migrate: {
    //     migrations: typesafeMigrationPipe([MigrationTo1, MigrationTo2]),
    //     version: 2,
    // },
});
