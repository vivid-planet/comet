import { Injectable, NestMiddleware } from "@nestjs/common";
import { type NextFunction, type Request, type Response } from "express";

import { AsyncLocalStorageService } from "./async-local-storage.service";

@Injectable()
export class AsyncLocalStorageMiddleware implements NestMiddleware {
    constructor(private readonly asyncLocalStorageService: AsyncLocalStorageService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        this.asyncLocalStorageService.run(() => next());
    }
}
