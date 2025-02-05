import { type MigrateOptions } from "../block";

type BlockFactoryNameOrOptions = string | { name: string; migrate?: MigrateOptions };

export { BlockFactoryNameOrOptions };
