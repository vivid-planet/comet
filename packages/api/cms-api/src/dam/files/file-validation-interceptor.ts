import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from "@nestjs/common";
import fs from "fs";
import { Observable, throwError } from "rxjs";
import * as util from "util";

import { svgContainsJavaScript } from "./files.utils";

const readFile = util.promisify(fs.readFile);
const unlinkFile = util.promisify(fs.unlink);
@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler<unknown>): Promise<Observable<unknown>> {
        const ctx = context.switchToHttp();
        const file = ctx.getRequest().file;

        if (file && file.mimetype === "image/svg+xml") {
            const fileContent = await readFile(file.path, { encoding: "utf-8" });

            // The svgContainsJavaScript check MUST happen in its own interceptor.
            // It can't happen in DamUploadFileInterceptor's fileFilter() because fileFilter() is executed
            // before the file is written to disk. Therefore, we can't access the file content in fileFilter().
            if (svgContainsJavaScript(fileContent)) {
                // https://github.com/expressjs/multer/blob/master/storage/disk.js#L54-L62
                const path = file.path;

                delete file.destination;
                delete file.filename;
                delete file.path;

                await unlinkFile(path);

                return throwError(() => new HttpException("Rejected File Upload: SVG must not contain JavaScript", 422));
            }
        }

        return next.handle();
    }
}
