import { MigrateOptions } from "../block";

type NameOrOptions = string | { name: string; migrate?: MigrateOptions };

export { NameOrOptions };
