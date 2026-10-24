import { type Bindings, createApp } from "./app";
import { createConfig } from "./config";

let app: ReturnType<typeof createApp> | undefined;

export default {
    fetch(request, env, executionContext) {
        // Created once per isolate, the environment doesn't change between requests
        app ??= createApp(createConfig(env as unknown as Record<string, unknown>));
        return app.fetch(request, env, executionContext);
    },
} satisfies ExportedHandler<Bindings>;
