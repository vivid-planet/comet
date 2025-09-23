import { ActionLogsService } from "@comet/cms-api";
import { SYSTEM_USER_NAME } from "@src/auth/auth.module";
import { CommandFactory } from "nest-commander";

import { AppModule } from "./app.module";
import { createConfig } from "./config/config";

const config = createConfig(process.env);

async function bootstrap() {
    const appModule = AppModule.forRoot(config);

    const app = await CommandFactory.createWithoutRunning(appModule, {
        logger: ["error", "warn", "log"],
        serviceErrorHandler: async (error) => {
            console.error(error);
            process.exit(1);
        },
    });

    await app.get(ActionLogsService).runWithUserId(SYSTEM_USER_NAME, async () => {
        await CommandFactory.runApplication(app);
        process.exit(0);
    });
}

bootstrap();
