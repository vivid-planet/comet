export interface VersionDataInterface {
    $$version?: number;
}

// Instead of passing 2 Generics to BlockMigrationInterface
// like so: BlockMigrationInterface<From, To>
// this technique allows to pass 'From' and 'To' with one generic
// BlockMigrationInterface<(from: From) => To>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockMigrationTransformFn = (from: any) => any;

// Types to infer From and To from TransformFn
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
export type From<T extends BlockMigrationTransformFn> = T extends (a: infer T) => any ? T & VersionDataInterface : VersionDataInterface;
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
export type To<T extends BlockMigrationTransformFn> = T extends (from: any) => infer T ? T & VersionDataInterface : VersionDataInterface;

// Public Interface
export interface BlockMigrationInterface<Fn extends BlockMigrationTransformFn = BlockMigrationTransformFn> {
    readonly toVersion: number;
    readonly supports: (raw: From<Fn> & VersionDataInterface) => boolean;
    readonly apply: (raw: From<Fn> & VersionDataInterface) => To<Fn> & VersionDataInterface;
}
