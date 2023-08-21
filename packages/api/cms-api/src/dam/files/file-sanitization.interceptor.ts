import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import DOMPurify from "dompurify";
import fs from "fs";
import { JSDOM } from "jsdom";
import { Observable } from "rxjs";

@Injectable()
export class FileSanitizationInterceptor implements NestInterceptor {
    private domPurify;

    constructor() {
        const window = new JSDOM("").window;
        this.domPurify = DOMPurify(window);
    }

    intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
        const ctx = context.switchToHttp();
        const file = ctx.getRequest().file;

        if (file && file.mimetype === "image/svg+xml") {
            const fileContent = fs.readFileSync(file.path, "utf-8");
            const sanitizedContent = this.domPurify.sanitize(fileContent);
            fs.writeFileSync(file.path, sanitizedContent);
        }

        return next.handle();
    }
}
