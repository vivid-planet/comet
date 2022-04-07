import { ClassType } from "class-transformer/ClassTransformer";

import { BlockDataFactory, BlockDataInterface } from "../blocks/block";
import { applyMigrations } from "./applyMigrations";
import { BlockMigrationInterface } from "./types";

// Decorates a BlockDataFactory to apply migrations
export function createAppliedMigrationsBlockDataFactoryDecorator(migrations?: ClassType<BlockMigrationInterface>[], blockName?: string) {
    return function appliedMigrationsBlockDataFactoryDecorator<T extends BlockDataInterface>(fn: BlockDataFactory<T>): BlockDataFactory<T> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoratedAppliedMigrationsBlockDataFactory: BlockDataFactory<T> = function decoratedAppliedMigrationsBlockDataFactory(value: any) {
            const blockData = fn(applyMigrations(value, migrations, blockName));

            return blockData;
        };
        return decoratedAppliedMigrationsBlockDataFactory;
    };
}
