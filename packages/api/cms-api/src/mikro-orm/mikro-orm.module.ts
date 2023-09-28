import { EntityCaseNamingStrategy, MigrationObject } from "@mikro-orm/core";
import { MikroOrmModule as MikroOrmNestjsModule, MikroOrmModuleOptions as MikroOrmNestjsOptions } from "@mikro-orm/nestjs";
import { DynamicModule, Module } from "@nestjs/common";
import fs from "fs";
import path from "path";

import { Migration20220127085859 } from "./migrations/Migration20220127085859";
import { Migration20220127085946 } from "./migrations/Migration20220127085946";
import { Migration20220127091538 } from "./migrations/Migration20220127091538";
import { Migration20220127091751 } from "./migrations/Migration20220127091751";
import { Migration20220127111301 } from "./migrations/Migration20220127111301";
import { Migration20220127142112 } from "./migrations/Migration20220127142112";
import { Migration20220620124134 } from "./migrations/Migration20220620124134";
import { Migration20220905145606 } from "./migrations/Migration20220905145606";
import { Migration20230209111818 } from "./migrations/Migration20230209111818";
import { Migration20230302145445 } from "./migrations/Migration20230302145445";
import { Migration20230613150332 } from "./migrations/Migration20230613150332";
import { Migration20230802124224 } from "./migrations/Migration20230802124224";

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
            migrationsList: [
                { name: "Migration20220127085859", class: Migration20220127085859 },
                { name: "Migration20220127085946", class: Migration20220127085946 },
                { name: "Migration20220127091538", class: Migration20220127091538 },
                { name: "Migration20220127091751", class: Migration20220127091751 },
                { name: "Migration20220127111301", class: Migration20220127111301 },
                { name: "Migration20220127142112", class: Migration20220127142112 },
                { name: "Migration20220620124134", class: Migration20220620124134 },
                { name: "Migration20230302145445", class: Migration20230302145445 },
                { name: "Migration20220905145606", class: Migration20220905145606 },
                { name: "Migration20230209111818", class: Migration20230209111818 },
                { name: "Migration20230613150332", class: Migration20230613150332 },
                { name: "Migration20230802124224", class: Migration20230802124224 },
                ...(migrations?.migrationsList || []),
            ],
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
