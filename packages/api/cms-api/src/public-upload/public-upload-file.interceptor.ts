import { Inject, Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { FileInterceptor as NestFileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import fs from "fs";
import * as multer from "multer";
import os from "os";
import { Observable } from "rxjs";
import { v4 as uuid } from "uuid";

import { CometValidationException } from "../common/errors/validation.exception";
import { FileValidationService } from "../dam/files/file-validation.service";
import { PUBLIC_UPLOAD_FILE_VALIDATION_SERVICE } from "./public-upload.constants";

export function PublicUploadFileInterceptor(fieldName: string): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;

        constructor(@Inject(PUBLIC_UPLOAD_FILE_VALIDATION_SERVICE) private readonly fileValidationService: FileValidationService) {
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
                    fileSize: fileValidationService.config.maxFileSize * 1024 * 1024,
                },
                fileFilter: (req, file, cb) => {
                    this.fileValidationService.validateFile(file).then((result) => {
                        if (result === true) {
                            return cb(null, true);
                        } else {
                            return cb(new CometValidationException(result), false);
                        }
                    });
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
