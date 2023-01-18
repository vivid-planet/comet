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

import { ExceptionInterceptor, ValidationExceptionFactory } from "@comet/cms-api";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "@src/app.module";
import { useContainer } from "class-validator";
import compression from "compression";
import cookieParser from "cookie-parser";

import { createConfig } from "./config/config";

async function bootstrap(): Promise<void> {
    const config = createConfig(process.env);
    const appModule = AppModule.forRoot(config);
    const app = await NestFactory.create<NestExpressApplication>(appModule);

    // class-validator should use Nest for dependency injection.
    // See https://github.com/nestjs/nest/issues/528,
    //     https://github.com/typestack/class-validator#using-service-container.
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.enableCors({
        credentials: true,
        origin: config.corsAllowedOrigins.map((val: string) => new RegExp(val)),
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

    app.use(compression());
    app.use(cookieParser());

    const port = config.apiPort;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/`);
}
bootstrap();
