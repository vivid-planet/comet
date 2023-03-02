import { Block, createOneOfBlock, ExternalLinkBlock, OneOfBlock } from "@comet/blocks-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";

import { InternalLinkBlockDataInterface, InternalLinkBlockInputInterface } from "../page-tree/blocks/createInternalLinkBlock";
import { RedirectInputFactory } from "./dto/redirect-input.factory";
import { RedirectEntityFactory } from "./entities/redirect-entity.factory";
import { createRedirectsResolver } from "./redirects.resolver";
import { RedirectsService } from "./redirects.service";
import { RedirectScopeInterface } from "./types";

type CustomTargets = Record<string, Block>;

export type RedirectsLinkBlock = OneOfBlock<
    CustomTargets & { internal: Block<InternalLinkBlockDataInterface, InternalLinkBlockInputInterface>; external: typeof ExternalLinkBlock }
>;

export const REDIRECTS_LINK_BLOCK = "REDIRECTS_LINK_BLOCK";

interface Config {
    customTargets?: CustomTargets;
    Scope?: Type<RedirectScopeInterface>;
    InternalLinkBlock: Block<InternalLinkBlockDataInterface, InternalLinkBlockInputInterface>;
}
@Global()
@Module({})
export class RedirectsModule {
    static register({ customTargets, Scope, InternalLinkBlock }: Config): DynamicModule {
        const linkBlock = createOneOfBlock(
            { supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, ...customTargets }, allowEmpty: false },
            "RedirectsLink",
        );

        const Redirect = RedirectEntityFactory.create({ linkBlock, Scope });
        const RedirectInput = RedirectInputFactory.create({ linkBlock });

        const linkBlockProvider: ValueProvider<RedirectsLinkBlock> = {
            provide: REDIRECTS_LINK_BLOCK,
            useValue: linkBlock,
        };

        return {
            module: RedirectsModule,
            imports: [MikroOrmModule.forFeature([Redirect])],
            providers: [createRedirectsResolver({ Redirect, RedirectInput, Scope }), RedirectsService, linkBlockProvider],
            exports: [RedirectsService],
        };
    }
}
