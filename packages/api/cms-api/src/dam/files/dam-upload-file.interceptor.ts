import { Inject, Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { FileInterceptor as NestFileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import fs from "fs";
import * as mimedb from "mime-db";
import * as multer from "multer";
import os from "os";
import { Observable } from "rxjs";
import { v4 as uuid } from "uuid";

import { CometValidationException } from "../../common/errors/validation.exception";
import { defaultDamAcceptedMimetypes } from "../common/mimeTypes/default-dam-accepted-mimetypes";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";

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

        intercept(...args: Parameters<NestInterceptor["intercept"]>): Observable<unknown> | Promise<Observable<unknown>> {
            return this.fileInterceptor.intercept(...args);
        }
    }
    return mixin(Interceptor);
}
