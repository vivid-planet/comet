import { CommandFactory } from "nest-commander";

import { AppModule } from "./app.module";
import { createConfig } from "./config/config";

const config = createConfig(process.env);

async function bootstrap() {
    const appModule = AppModule.forRoot(config);

    // @ts-expect-error CommandFactory doesn't except DynamicModule, only Type<any>
    await CommandFactory.run(appModule, {
        logger: ["error", "warn", "log"],
        serviceErrorHandler: async (error) => {
            console.error(error);
            process.exit(1);
        },
    });
}

bootstrap();
