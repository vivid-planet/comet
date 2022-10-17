import { EntityCaseNamingStrategy, MigrationObject } from "@mikro-orm/core";
import { MikroOrmModule as MikroOrmNestjsModule, MikroOrmModuleOptions as MikroOrmNestjsOptions } from "@mikro-orm/nestjs";
import { DynamicModule, Module } from "@nestjs/common";
import fs from "fs";
import path from "path";

export const PG_UNIQUE_CONSTRAINT_VIOLATION = "23505";

export interface MikroOrmModuleOptions {
    ormConfig: MikroOrmNestjsOptions;
}

export function createMigrationsList(migrationsDir: string): MigrationObject[] {
    if (!fs.existsSync(migrationsDir)) {
        return [];
    }

    const files = fs.readdirSync(migrationsDir);

    // We use the file extension to differentiate between the development setup and the production environment. During development migrations are
    // loaded from the source directory (typically `src/`) and have a ".ts" extension. In production migrations are loaded from the output directory
    // (typically `dist/` or `lib/`) and may either have a ".js", a ".js.map" or a ".d.ts" extensions (we are only interested in ".js" files). We
    // therefore assume to be in the development setup when all files in the migration directory have a ".ts" file extension.
    const isInSourceDirectory = files.filter((file) => file != ".snapshot-main.json").every((file) => file.endsWith(".ts"));
    const fileExtension = isInSourceDirectory ? ".ts" : ".js";

    return files
        .filter((file) => file.endsWith(fileExtension))
        .map((file) => {
            const { name } = path.parse(file);

            return {
                name,
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                class: require(`${migrationsDir}/${file}`)[name],
            };
        });
}

export function createOrmConfig({ migrations, ...defaults }: MikroOrmNestjsOptions): MikroOrmNestjsOptions {
    return {
        ...defaults,
        namingStrategy: EntityCaseNamingStrategy,
        migrations: {
            ...migrations,
            migrationsList: [...createMigrationsList(path.resolve(__dirname, "migrations")), ...(migrations?.migrationsList || [])],
        },
    };
}

@Module({})
export class MikroOrmModule {
    static forRoot({ ormConfig: { autoLoadEntities, ...config } }: MikroOrmModuleOptions): DynamicModule {
        return {
            imports: [
                MikroOrmNestjsModule.forRoot({
                    ...config,
                    autoLoadEntities: autoLoadEntities ?? true,
                }),
            ],
            module: MikroOrmNestjsModule,
            providers: [],
            exports: [],
            global: true,
        };
    }
}
