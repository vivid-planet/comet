import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { useContainer } from "class-validator";
import { CommandFactory } from "nest-commander";

import { AppModule } from "./app.module";
import { createConfig } from "./config/config";

const config = createConfig(process.env);

async function bootstrap() {
    const appModule = AppModule.forRoot(config);

    // class-validator should use Nest for dependency injection.
    // See https://github.com/nestjs/nest/issues/528,
    //     https://github.com/typestack/class-validator#using-service-container.
    const app = await NestFactory.create<NestExpressApplication>(appModule);
    useContainer(app, { fallbackOnErrors: true });

    await CommandFactory.run(appModule, {
        logger: ["error", "warn", "log"],
        serviceErrorHandler: async (error) => {
            console.error(error);
            process.exit(1);
        },
    });
    await app.close();
}

bootstrap();
