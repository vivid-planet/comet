import { AppModule } from "@src/app.module";
import { BootstrapConsole } from "nestjs-console";

import { createConfig } from "./config/config";

const config = createConfig(process.env);
const bootstrap = new BootstrapConsole({
    module: AppModule.forRoot(config),
    useDecorators: true,
    contextOptions: {
        logger: ["error", "warn", "log"],
    },
});

bootstrap.init().then(async (app) => {
    try {
        // init your app
        await app.init();
        // boot the cli
        await bootstrap.boot();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
