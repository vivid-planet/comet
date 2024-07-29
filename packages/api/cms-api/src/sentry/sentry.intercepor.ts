import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Observable, tap } from "rxjs";

type SentryInterceptorShouldReport = (exception: unknown) => boolean;

export type SentryInterceptorOptions = {
    shouldReport?: SentryInterceptorShouldReport;
};

type Sentry = typeof import("@sentry/node");

@Injectable()
export class SentryInterceptor implements NestInterceptor {
    shouldReport: SentryInterceptorShouldReport;
    sentry: Sentry;

    constructor({ shouldReport }: SentryInterceptorOptions, sentry: Sentry) {
        this.sentry = sentry;
        this.shouldReport = (error: unknown) => {
            if (shouldReport) {
                return shouldReport(error);
            }

            return true;
        };
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            tap({
                error: (error) => {
                    if (this.shouldReport(error)) {
                        this.configureSentryScopeBasedOnContext(context);

                        this.sentry.captureException(error);
                    }
                },
            }),
        );
    }

    private configureSentryScopeBasedOnContext(context: ExecutionContext) {
        const type = context.getType<GqlContextType>();
        const scope = this.sentry.getCurrentScope();

        if (type === "http") {
            const request = context.switchToHttp().getRequest();

            if (request.user) {
                scope.setExtra("user", request.user);
            }

            scope.setExtra("method", request.method);
            scope.setExtra("url", request.url);
            scope.setExtra("body", request.body);
            scope.setExtra("query", request.query);
            scope.setExtra("params", request.params);
            scope.setExtra("headers", request.headers);
        } else if (type === "graphql") {
            const gqlContext = GqlExecutionContext.create(context);
            const request = gqlContext.getContext().req;

            if (request.user) {
                scope.setExtra("user", request.user);
            }

            scope.setExtra("args", gqlContext.getArgs());
            scope.setExtra("root", gqlContext.getRoot());
            scope.setExtra("context", gqlContext.getContext());
            scope.setExtra("info", gqlContext.getInfo());
        }
    }
}
