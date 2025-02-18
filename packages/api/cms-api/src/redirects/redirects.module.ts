import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";

import { Block } from "../blocks/block";
import { ExternalLinkBlock } from "../blocks/ExternalLinkBlock";
import { createOneOfBlock, OneOfBlock } from "../blocks/factories/createOneOfBlock";
import { DependenciesResolverFactory } from "../dependencies/dependencies.resolver.factory";
import { InternalLinkBlock, InternalLinkBlockData, InternalLinkBlockInput } from "../page-tree/blocks/internal-link.block";
import { RedirectInputFactory } from "./dto/redirect-input.factory";
import { RedirectEntityFactory } from "./entities/redirect-entity.factory";
import { ImportRedirectsCommand } from "./import-redirects.command";
import { REDIRECTS_LINK_BLOCK } from "./redirects.constants";
import { createRedirectsResolver } from "./redirects.resolver";
import { RedirectsService } from "./redirects.service";
import { RedirectScopeInterface } from "./types";

type CustomTargets = Record<string, Block>;

export type RedirectsLinkBlock = OneOfBlock<
    CustomTargets & { internal: Block<InternalLinkBlockData, InternalLinkBlockInput>; external: typeof ExternalLinkBlock }
>;

interface Config {
    customTargets?: CustomTargets;
    Scope?: Type<RedirectScopeInterface>;
}
@Global()
@Module({})
export class RedirectsModule {
    static register({ customTargets, Scope }: Config = {}): DynamicModule {
        const linkBlock = createOneOfBlock(
            {
                supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, ...customTargets },
                allowEmpty: false,
            },
            "RedirectsLink",
        );

        const Redirect = RedirectEntityFactory.create({ linkBlock, Scope });
        const RedirectInput = RedirectInputFactory.create({ linkBlock });
        const RedirectsResolver = createRedirectsResolver({ Redirect, RedirectInput, Scope });
        const RedirectsDependenciesResolver = DependenciesResolverFactory.create(Redirect);

        const linkBlockProvider: ValueProvider<RedirectsLinkBlock> = {
            provide: REDIRECTS_LINK_BLOCK,
            useValue: linkBlock,
        };

        const mikroOrmModule = MikroOrmModule.forFeature([Redirect]);

        return {
            module: RedirectsModule,
            imports: [mikroOrmModule],
            providers: [RedirectsResolver, RedirectsDependenciesResolver, RedirectsService, linkBlockProvider, ImportRedirectsCommand],
            exports: [RedirectsService, REDIRECTS_LINK_BLOCK, mikroOrmModule],
        };
    }
}
