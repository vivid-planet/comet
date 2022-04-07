import { ClassType } from "class-transformer/ClassTransformer";

import { BlockMigrationInterface, BlockMigrationTransformFn } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MigrationClass<T extends BlockMigrationTransformFn = any> = ClassType<BlockMigrationInterface<T>>; // alias

// For type-safety
export function typesafeMigrationPipe<A1, R1, R2, R3, R4, R5, R6, R7>(
    migrations: [
        MigrationClass<(arg: A1) => R1>,
        MigrationClass<(arg: R1) => R2>,
        MigrationClass<(arg: R2) => R3>,
        MigrationClass<(arg: R3) => R4>,
        MigrationClass<(arg: R4) => R5>,
        MigrationClass<(arg: R5) => R6>,
        MigrationClass<(arg: R6) => R7>,
    ],
): typeof migrations;
export function typesafeMigrationPipe<A1, R1, R2, R3, R4, R5, R6>(
    migrations: [
        MigrationClass<(arg: A1) => R1>,
        MigrationClass<(arg: R1) => R2>,
        MigrationClass<(arg: R2) => R3>,
        MigrationClass<(arg: R3) => R4>,
        MigrationClass<(arg: R4) => R5>,
        MigrationClass<(arg: R5) => R6>,
    ],
): typeof migrations;
export function typesafeMigrationPipe<A1, R1, R2, R3, R4, R5>(
    migrations: [
        MigrationClass<(arg: A1) => R1>,
        MigrationClass<(arg: R1) => R2>,
        MigrationClass<(arg: R2) => R3>,
        MigrationClass<(arg: R3) => R4>,
        MigrationClass<(arg: R4) => R5>,
    ],
): typeof migrations;
export function typesafeMigrationPipe<A1, R1, R2, R3, R4>(
    migrations: [MigrationClass<(arg: A1) => R1>, MigrationClass<(arg: R1) => R2>, MigrationClass<(arg: R2) => R3>, MigrationClass<(arg: R3) => R4>],
): typeof migrations;
export function typesafeMigrationPipe<A1, R1, R2, R3>(
    migrations: [MigrationClass<(arg: A1) => R1>, MigrationClass<(arg: R1) => R2>, MigrationClass<(arg: R2) => R3>],
): typeof migrations;
export function typesafeMigrationPipe<A1, R1, R2>(migrations: [MigrationClass<(arg: A1) => R1>, MigrationClass<(arg: R1) => R2>]): typeof migrations;
export function typesafeMigrationPipe<A1, R1>(migrations: [MigrationClass<(arg: A1) => R1>]): typeof migrations;
export function typesafeMigrationPipe(migrations: MigrationClass[]): typeof migrations {
    // type-safety is limited to 7 Migrations
    return migrations;
}
