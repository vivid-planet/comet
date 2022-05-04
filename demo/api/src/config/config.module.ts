import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { configNS, EnvironmentVariables } from "@src/config/config.namespace";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";

@Module({
    imports: [
        NestConfigModule.forRoot({
            validate: (config) => {
                const validatedConfig = plainToClass(EnvironmentVariables, config);
                const errors = validateSync(validatedConfig, { skipMissingProperties: false });

                if (errors.length > 0) {
                    throw new Error(errors.toString());
                }

                return validatedConfig;
            },
            load: [configNS],
        }),
    ],
    providers: [
        {
            provide: configNS.KEY,
            useValue: plainToClass(EnvironmentVariables, configNS()),
        },
    ],
    exports: [configNS.KEY],
})
export class ConfigModule {}
