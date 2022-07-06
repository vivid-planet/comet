import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type } from "@nestjs/common";

import { PageTreeNodeInterface } from "../page-tree/types";
import { Redirect } from "./entities/redirect.entity";
import { createRedirectsResolver } from "./redirects.resolver";
import { RedirectsService } from "./redirects.service";
import { PageExistsConstraint } from "./validators/pageExists";

interface Config {
    PageTreeNode: Type<PageTreeNodeInterface>;
}
@Global()
@Module({})
export class RedirectsModule {
    static register({ PageTreeNode }: Config): DynamicModule {
        return {
            module: RedirectsModule,
            imports: [MikroOrmModule.forFeature([Redirect])],
            providers: [createRedirectsResolver(PageTreeNode), RedirectsService, PageExistsConstraint],
            exports: [RedirectsService],
        };
    }
}
