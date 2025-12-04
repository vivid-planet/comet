import type { ClassConstructor } from "class-transformer";

import { type BlockDataFactory, type BlockDataInterface } from "../block";
import { applyMigrations } from "./applyMigrations";
import { type BlockMigrationInterface } from "./types";

// Decorates a BlockDataFactory to apply migrations
export function createAppliedMigrationsBlockDataFactoryDecorator(migrations?: ClassConstructor<BlockMigrationInterface>[], blockName?: string) {
    return function appliedMigrationsBlockDataFactoryDecorator<T extends BlockDataInterface>(fn: BlockDataFactory<T>): BlockDataFactory<T> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoratedAppliedMigrationsBlockDataFactory: BlockDataFactory<T> = function decoratedAppliedMigrationsBlockDataFactory(value: any) {
            const blockData = fn(applyMigrations(value, migrations, blockName));

            return blockData;
        };
        return decoratedAppliedMigrationsBlockDataFactory;
    };
}
