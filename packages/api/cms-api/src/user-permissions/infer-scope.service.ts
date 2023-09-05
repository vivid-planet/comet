import { MikroORM } from "@mikro-orm/core";
import { ExecutionContext, Injectable, Optional } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request, Response } from "express";
import get from "lodash.get";
import multer from "multer";

import { ScopedEntity } from "../common/decorators/scoped-entity.decorator";
import { PageTreeService } from "../page-tree/page-tree.service";
import { AffectedContentScope } from "./decorators/affected-content-scope.decorator";
import { AffectedEntity } from "./decorators/affected-entity.decorator";
import { ContentScope } from "./interfaces/content-scope.interface";

@Injectable()
export class InferScopeService {
    constructor(private reflector: Reflector, private readonly orm: MikroORM, @Optional() private readonly pageTreeService?: PageTreeService) {}

    async inferScopeFromExecutionContext(context: ExecutionContext): Promise<ContentScope> {
        const affectedEntity = this.reflector.getAllAndOverride<AffectedEntity>("affectedEntity", [context.getHandler(), context.getClass()]);
        if (affectedEntity) {
            if (affectedEntity.options?.pageTreeArgsSelector) {
                if (this.pageTreeService === undefined) throw new Error("pageTreeArgsSelector was given but no PageTreeModule is registered");
                const nodeId = await this.getFromArgs(context, affectedEntity.options.pageTreeArgsSelector);
                const node = await this.pageTreeService.createReadApi({ visibility: "all" }).getNode(nodeId);
                if (!node) throw new Error(`Can't find pageTreeNode with ID ${nodeId}`);
                if (!node.scope) throw new Error(`PageTreeNode with ID ${nodeId} has no scope`);
                return node.scope;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const repo = this.orm.em.getRepository<any>(affectedEntity.entity);
                const id = await this.getFromArgs(context, affectedEntity.options?.argsSelector ?? "id");
                const row = await repo.findOneOrFail(id);
                if (row.scope) {
                    return row.scope;
                } else {
                    const scopedEntity = this.reflector.getAllAndOverride<ScopedEntity>("scopedEntity", [affectedEntity.entity]);
                    if (!scopedEntity) throw new Error(`Missing @ScopedEntity() decorator in entity ${affectedEntity.entity.name}`);
                    return scopedEntity(row);
                }
            }
        } else {
            const affectedContentScope = this.reflector.getAllAndOverride<AffectedContentScope>("affectedContentScope", [
                context.getHandler(),
                context.getClass(),
            ]);
            return this.getFromArgs(context, affectedContentScope?.argsSelector ?? "scope");
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async getFromArgs(context: ExecutionContext, selector: string): Promise<any> {
        let args: Record<string, unknown>;

        if (context.getType().toString() === "graphql") {
            args = GqlExecutionContext.create(context).getArgs();
        } else {
            const request = context.switchToHttp().getRequest();
            const postMulterRequest: Request = await new Promise((resolve, reject) => {
                multer().any()(request, {} as Response, function (err) {
                    if (err) reject(err);
                    resolve(request);
                });
            });
            args = postMulterRequest.body;
        }

        const ret = get(args, selector, "") as string;
        if (!ret) throw new Error(`Could not evaluate ${selector} from args`);
        return ret;
    }
}
