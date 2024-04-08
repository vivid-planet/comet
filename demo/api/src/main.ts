import helmet from "helmet";

if (process.env.TRACING_ENABLED) {
    require("./tracing");
}

import { ExceptionInterceptor, ValidationExceptionFactory } from "@comet/cms-api";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "@src/app.module";
import { useContainer } from "class-validator";
import compression from "compression";
import cookieParser from "cookie-parser";
import { json } from "express";

import { createConfig } from "./config/config";

async function bootstrap(): Promise<void> {
    const config = createConfig(process.env);
    const appModule = AppModule.forRoot(config);
    const app = await NestFactory.create<NestExpressApplication>(appModule);

    // class-validator should use Nest for dependency injection.
    // See https://github.com/nestjs/nest/issues/528,
    //     https://github.com/typestack/class-validator#using-service-container.
    useContainer(app.select(appModule), { fallbackOnErrors: true });

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

    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: false,
                directives: {
                    "default-src": helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
                    // locally: allow localhost in frame-ancestors to enable including files from the API in iframes in admin
                    "frame-ancestors": `'self' ${process.env.NODE_ENV === "development" ? config.adminUrl : ""}`,
                },
            },
        }),
    );
    app.use(json({ limit: "1mb" })); // increase default limit of 100kb for saving large pages
    app.use(compression());
    app.use(cookieParser());

    const port = config.apiPort;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/`);
}
bootstrap();
