import { AppModule } from "@src/app.module";
import { BootstrapConsole } from "nestjs-console";

const bootstrap = new BootstrapConsole({
    module: AppModule,
    useDecorators: true,
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
