import { Block, createOneOfBlock, ExternalLinkBlock, OneOfBlock } from "@comet/blocks-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, ValueProvider } from "@nestjs/common";

import { InternalLinkBlock } from "../page-tree/blocks/internal-link.block";
import { RedirectInputFactory } from "./dto/redirect-input.factory";
import { RedirectEntityFactory } from "./entities/redirect-entity.factory";
import { createRedirectsResolver } from "./redirects.resolver";
import { RedirectsService } from "./redirects.service";

type CustomTargets = Record<string, Block>;

export type RedirectsLinkBlock = OneOfBlock<CustomTargets & { internal: typeof InternalLinkBlock; external: typeof ExternalLinkBlock }>;

export const REDIRECTS_LINK_BLOCK = "REDIRECTS_LINK_BLOCK";

interface Config {
    customTargets?: CustomTargets;
}
@Global()
@Module({})
export class RedirectsModule {
    static register({ customTargets }: Config = {}): DynamicModule {
        const linkBlock = createOneOfBlock(
            { supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, ...customTargets }, allowEmpty: false },
            "RedirectsLink",
        );

        const Redirect = RedirectEntityFactory.create(linkBlock);
        const RedirectInput = RedirectInputFactory.create(linkBlock);

        const linkBlockProvider: ValueProvider<RedirectsLinkBlock> = {
            provide: REDIRECTS_LINK_BLOCK,
            useValue: linkBlock,
        };

        return {
            module: RedirectsModule,
            imports: [MikroOrmModule.forFeature([Redirect])],
            providers: [createRedirectsResolver(Redirect, RedirectInput), RedirectsService, linkBlockProvider],
            exports: [RedirectsService],
        };
    }
}
