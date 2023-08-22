import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import DOMPurify from "dompurify";
import fs from "fs";
import { JSDOM } from "jsdom";
import { Observable } from "rxjs";
import * as util from "util";

@Injectable()
export class FileSanitizationInterceptor implements NestInterceptor {
    private domPurify;

    constructor() {
        const window = new JSDOM("").window;
        this.domPurify = DOMPurify(window);
    }

    async intercept(context: ExecutionContext, next: CallHandler<unknown>): Promise<Observable<unknown>> {
        const ctx = context.switchToHttp();
        const file = ctx.getRequest().file;

        if (file && file.mimetype === "image/svg+xml") {
            const readFile = util.promisify(fs.readFile);
            const writeFile = util.promisify(fs.writeFile);

            const fileContent = await readFile(file.path, { encoding: "utf-8" });
            const sanitizedContent = this.domPurify.sanitize(fileContent);
            await writeFile(file.path, sanitizedContent);
        }

        return next.handle();
    }
}
