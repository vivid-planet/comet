import { Inject, Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { FileInterceptor as NestFileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import fs from "fs";
import * as mimedb from "mime-db";
import * as multer from "multer";
import os from "os";
import { Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";

import { CometValidationException } from "../common/errors/validation.exception";
import { PublicUploadConfig } from "./public-upload.config";
import { PUBLIC_UPLOAD_CONFIG } from "./public-upload.constants";
import { acceptedMimeTypesByCategory } from "./public-uploads.controller";

export function PublicUploadFileInterceptor(fieldName: string): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;

        constructor(@Inject(PUBLIC_UPLOAD_CONFIG) private readonly config: PublicUploadConfig) {
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
                        cb(null, `${uuidv4()}-${file.originalname}`);
                    },
                }),
                limits: {
                    fileSize: config.maxFileSize * 1024 * 1024,
                },
                fileFilter: (req, file, cb) => {
                    if (Object.values(acceptedMimeTypesByCategory).every((mimetypes) => !mimetypes.includes(file.mimetype))) {
                        return cb(new CometValidationException(`Unsupported mime type: ${file.mimetype}`), false);
                    }

                    const extension = file.originalname.split(".").pop()?.toLowerCase();
                    if (extension === undefined) {
                        return cb(new CometValidationException(`Invalid file name: Missing file extension`), false);
                    }

                    const supportedExtensions = mimedb[file.mimetype].extensions;
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
