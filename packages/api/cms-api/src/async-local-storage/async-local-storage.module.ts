import { type DynamicModule, Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AsyncLocalStorageMiddleware } from "./async-local-storage.middleware";
import { AsyncLocalStorageService } from "./async-local-storage.service";

@Global()
@Module({})
export class AsyncLocalStorageModule implements NestModule {
    static forRoot(): DynamicModule {
        return {
            module: AsyncLocalStorageModule,
            providers: [AsyncLocalStorageService],
            exports: [AsyncLocalStorageService],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AsyncLocalStorageMiddleware).forRoutes("*path");
    }
}
