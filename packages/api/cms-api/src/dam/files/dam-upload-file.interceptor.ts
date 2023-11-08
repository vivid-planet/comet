import { CallHandler, ExecutionContext, HttpException, Inject, Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { FileInterceptor as NestFileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import fs from "fs";
import * as multer from "multer";
import os from "os";
import { Observable, throwError } from "rxjs";
import { v4 as uuid } from "uuid";

import { CometValidationException } from "../../common/errors/validation.exception";
import { DAM_FILE_VALIDATION_SERVICE } from "../dam.constants";
import { FileValidationService } from "./file-validation.service";

export function DamUploadFileInterceptor(fieldName: string): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;

        constructor(@Inject(DAM_FILE_VALIDATION_SERVICE) private readonly fileValidationService: FileValidationService) {
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
                    fileSize: this.fileValidationService.config.maxFileSize * 1024 * 1024,
                },
                fileFilter: (req, file, cb) => {
                    this.fileValidationService.validateFileMetadata(file).then((result) => {
                        if (result === undefined) {
                            return cb(null, true);
                        } else {
                            return cb(new CometValidationException(result), false);
                        }
                    });
                },
            };

            this.fileInterceptor = new (NestFileInterceptor(fieldName, multerOptions))();
        }

        async intercept(context: ExecutionContext, next: CallHandler<unknown>): Promise<Observable<unknown>> {
            const fileInterceptor = await this.fileInterceptor.intercept(context, next);

            const ctx = context.switchToHttp();
            const file = ctx.getRequest().file;

            const error = await this.fileValidationService.validateFileContents(file);

            if (error) {
                return throwError(() => new HttpException(`Rejected File Upload: ${error}`, 422));
            }

            return fileInterceptor;
        }
    }
    return mixin(Interceptor);
}
