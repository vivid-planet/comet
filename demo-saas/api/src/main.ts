import helmet from "helmet";

if (process.env.TRACING == "production") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("./tracing.production");
} else if (process.env.TRACING == "dev") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("./tracing.dev");
}

import { CdnGuard, ExceptionFilter, ValidationExceptionFactory } from "@comet/cms-api";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type NestExpressApplication } from "@nestjs/platform-express";
import * as Sentry from "@sentry/node";
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

    Sentry.setupExpressErrorHandler(app);

    // class-validator should use Nest for dependency injection.
    // See https://github.com/nestjs/nest/issues/528,
    //     https://github.com/typestack/class-validator#using-service-container.
    useContainer(app.select(appModule), { fallbackOnErrors: true });

    app.setGlobalPrefix("api");
    app.enableCors({
        credentials: true,
        origin: config.corsAllowedOrigins.map((val: string) => new RegExp(val)),
    });

    app.useGlobalFilters(new ExceptionFilter(config.debug));
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

    // TODO: described in the mikro orm discussion, do I need this?
    // app.use((request: Request, response: Response, next: NextFunction) => {
    //     const orm = app.get<MikroORM>(MikroORM);

    //     RequestContext.create(orm.em, next);
    // });

    // if CDN is enabled, make sure all traffic is either coming from the CDN or internal sources
    if (config.cdn.originCheckSecret) {
        app.useGlobalGuards(new CdnGuard({ headerName: "x-cdn-origin-check", headerValue: config.cdn.originCheckSecret }));
    }

    const port = config.apiPort;
    const host = config.serverHost;
    await app.listen(port, host);
    console.log(`Application is running on: http://${host}:${port}/`);
}
bootstrap();
