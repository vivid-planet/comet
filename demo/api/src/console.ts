import { CommandFactory } from "nest-commander";

import { AppModule } from "./app.module";
import { createConfig } from "./config/config";

const config = createConfig(process.env);

async function bootstrap() {
    const appModule = AppModule.forRoot(config);

    await CommandFactory.run(appModule, {
        logger: ["error", "warn", "log"],
        serviceErrorHandler: async (error) => {
            console.error(error);
            process.exit(1);
        },
    });
}

bootstrap();
