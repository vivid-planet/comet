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

    app.use(compression());
    app.use(cookieParser());

    const port = config.apiPort;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/`);
}
bootstrap();
