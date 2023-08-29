import { HttpException, Inject, Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { CallHandler } from "@nestjs/common/interfaces/features/nest-interceptor.interface";
import { FileInterceptor as NestFileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import fs from "fs";
import * as mimedb from "mime-db";
import * as multer from "multer";
import os from "os";
import { Observable, throwError } from "rxjs";
import util from "util";
import { v4 as uuid } from "uuid";

import { CometValidationException } from "../../common/errors/validation.exception";
import { defaultDamAcceptedMimetypes } from "../common/mimeTypes/default-dam-accepted-mimetypes";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { svgContainsJavaScript } from "./files.utils";

const readFile = util.promisify(fs.readFile);
const unlinkFile = util.promisify(fs.unlink);

export function DamUploadFileInterceptor(fieldName: string): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;

        constructor(@Inject(DAM_CONFIG) private readonly config: DamConfig) {
            const multerOptions: MulterOptions = {
                storage: multer.diskStorage({
                    destination: function (req, file, cb) {
                        const destination = `${os.tmpdir()}/uploads`;
                        fs.access(destination, (err) => {
                            if (err) {
                                fs.mkdir(destination, () => {
                                    cb(null, destination);
                                });
                            } else {
                                cb(null, destination);
                            }
                        });
                    },
                    filename: function (req, file, cb) {
                        cb(null, `${uuid()}-${file.originalname}`);
                    },
                }),
                limits: {
                    fileSize: config.maxFileSize * 1024 * 1024,
                },
                fileFilter: (req, file, cb) => {
                    const acceptedMimeTypes = [...defaultDamAcceptedMimetypes, ...(config.additionalMimeTypes ?? [])];

                    if (!acceptedMimeTypes.includes(file.mimetype)) {
                        return cb(new CometValidationException(`Unsupported mime type: ${file.mimetype}`), false);
                    }

                    const extension = file.originalname.split(".").pop()?.toLowerCase();
                    if (extension === undefined) {
                        return cb(new CometValidationException(`Invalid file name: Missing file extension`), false);
                    }

                    let supportedExtensions: readonly string[] | undefined;
                    if (file.mimetype === "application/x-zip-compressed") {
                        // zip files in Windows, not supported by mime-db
                        // see https://github.com/jshttp/mime-db/issues/245
                        supportedExtensions = ["zip"];
                    } else {
                        supportedExtensions = mimedb[file.mimetype]?.extensions;
                    }

                    if (supportedExtensions === undefined || !supportedExtensions.includes(extension)) {
                        return cb(
                            new CometValidationException(`File type and extension mismatch: .${extension} and ${file.mimetype} are incompatible`),
                            false,
                        );
                    }

                    return cb(null, true);
                },
            };

            this.fileInterceptor = new (NestFileInterceptor(fieldName, multerOptions))();
        }

        async validateFileContent(file: {
            mimetype: string;
            destination?: string;
            filename?: string;
            path?: string;
        }): Promise<Observable<unknown> | undefined> {
            if (file && file.path && file.mimetype === "image/svg+xml") {
                const fileContent = await readFile(file.path, { encoding: "utf-8" });

                if (svgContainsJavaScript(fileContent)) {
                    // https://github.com/expressjs/multer/blob/master/storage/disk.js#L54-L62
                    const path = file.path;

                    delete file.destination;
                    delete file.filename;
                    delete file.path;

                    if (path) {
                        await unlinkFile(path);
                    }

                    return throwError(() => new HttpException("Rejected File Upload: SVG must not contain JavaScript", 422));
                }
            }
        }

        async intercept(context: ExecutionContext, next: CallHandler<unknown>): Promise<Observable<unknown>> {
            const fileInterceptor = await this.fileInterceptor.intercept(context, next);

            const ctx = context.switchToHttp();
            const file = ctx.getRequest().file;

            const err = await this.validateFileContent(file);
            if (err) {
                return err;
            }

            return fileInterceptor;
        }
    }
    return mixin(Interceptor);
}
