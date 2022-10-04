import { Block, ExternalLinkBlock, OneOfBlock } from "@comet/blocks-api";
import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type } from "@nestjs/common";

import { InternalLinkBlock } from "../page-tree/blocks/internal-link.block";
import { RedirectBaseInput } from "./dto/redirect-base.input";
import { RedirectBase } from "./entities/redirect-base.entity";
import { REDIRECT_REPOSITORY } from "./redirect.constants";
import { createRedirectsResolver } from "./redirects.resolver";
import { RedirectsService } from "./redirects.service";
import type { RedirectInterface, RedirectScopeInterface } from "./types";

type CustomTargets = Record<string, Block>;

export type RedirectsLinkBlock = OneOfBlock<CustomTargets & { internal: typeof InternalLinkBlock; external: typeof ExternalLinkBlock }>;

export const REDIRECTS_LINK_BLOCK = "REDIRECTS_LINK_BLOCK";

interface RedirectsModuleOptions {
    Redirect: Type<RedirectBase>;
    RedirectInput: Type<RedirectBaseInput>;
    Scope?: Type<RedirectScopeInterface>;
    LinkBlock: Block;
}
@Global()
@Module({})
export class RedirectsModule {
    static forRoot(options: RedirectsModuleOptions): DynamicModule {
        const { Redirect, RedirectInput, Scope, LinkBlock } = options;

        const redirectResolver = createRedirectsResolver({
            Redirect,
            RedirectInput,
            Scope,
        });

        const repositoryProvider = {
            provide: REDIRECT_REPOSITORY,
            useFactory: async (em: EntityManager): Promise<EntityRepository<RedirectInterface>> => {
                return em.getRepository(Redirect);
            },
            inject: [EntityManager],
        };

        const linkBlockProvider = {
            provide: REDIRECTS_LINK_BLOCK,
            useValue: LinkBlock,
        };
        return {
            module: RedirectsModule,
            imports: [MikroOrmModule.forFeature([Redirect, ...(Scope ? [Scope] : [])])],
            providers: [redirectResolver, RedirectsService, repositoryProvider, linkBlockProvider],
            exports: [RedirectsService],
        };
    }
}
