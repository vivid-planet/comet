// Add this to the VERY top of the first file loaded in your app
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("elastic-apm-node").start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: `comet-api-${process.env.APP_ENV}`,

    // Use if APM Server requires a token
    secretToken: "",

    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: process.env.APM_URL,

    active: !!process.env.API_ENABLE_APM,
});

import { ExceptionInterceptor, GlobalAuthGuard, PageTreeService, ValidationExceptionFactory } from "@comet/cms-api";
import { MikroORM } from "@mikro-orm/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "@src/app.module";
import { configNS } from "@src/config/config.namespace";
import { useContainer } from "class-validator";
import compression from "compression";
import cookieParser from "cookie-parser";

import { GlobalScopeGuard } from "./auth/scope.guard";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // class-validator should use Nest for dependency injection.
    // See https://github.com/nestjs/nest/issues/528,
    //     https://github.com/typestack/class-validator#using-service-container.
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const config = app.get(configNS.KEY) as ConfigType<typeof configNS>;
    app.enableCors({
        credentials: true,
        origin: config.CORS_ALLOWED_ORIGINS.split(",").map((val: string) => new RegExp(val)),
    });

    app.useGlobalInterceptors(new ExceptionInterceptor(config.debug));
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: ValidationExceptionFactory,
            transform: true,
            forbidNonWhitelisted: true,
            whitelist: true,
        }),
    );

    app.useGlobalGuards(new GlobalAuthGuard(app.get(Reflector)));
    app.useGlobalGuards(new GlobalScopeGuard(app.get(Reflector), app.get(MikroORM), app.get(PageTreeService)));
    app.use(compression());
    app.use(cookieParser());

    const port = config.API_PORT;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/`);
}
bootstrap();
