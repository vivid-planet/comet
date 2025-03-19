import { Block, createOneOfBlock, ExternalLinkBlock, OneOfBlock } from "@comet/blocks-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ClassProvider, DynamicModule, FactoryProvider, Global, Module, ModuleMetadata, Type, ValueProvider } from "@nestjs/common";

import { DependenciesResolverFactory } from "../dependencies/dependencies.resolver.factory";
import { InternalLinkBlock, InternalLinkBlockData, InternalLinkBlockInput } from "../page-tree/blocks/internal-link.block";
import { RedirectInputFactory } from "./dto/redirect-input.factory";
import { RedirectEntityFactory } from "./entities/redirect-entity.factory";
import { ImportRedirectsConsole } from "./import-redirects.console";
import { DefaultRedirectTargetUrlService, RedirectTargetUrlServiceInterface } from "./redirect-target-url.service";
import { REDIRECTS_LINK_BLOCK, REDIRECTS_TARGET_URL_SERVICE } from "./redirects.constants";
import { createRedirectsResolver } from "./redirects.resolver";
import { RedirectsService } from "./redirects.service";
import { RedirectScopeInterface } from "./types";

type CustomTargets = Record<string, Block>;

export type RedirectsLinkBlock = OneOfBlock<
    CustomTargets & { internal: Block<InternalLinkBlockData, InternalLinkBlockInput>; external: typeof ExternalLinkBlock }
>;

type RedirectsModuleStaticOptions = {
    customTargets?: CustomTargets;
    Scope?: Type<RedirectScopeInterface>;
};

type RedirectsModuleDynamicOptions = {
    targetUrlService?: RedirectTargetUrlServiceInterface | Type<RedirectTargetUrlServiceInterface>;
};

type RedirectsModuleOptions = RedirectsModuleStaticOptions;

type RedirectsModuleAsyncOptions = RedirectsModuleStaticOptions &
    Pick<ModuleMetadata, "imports"> &
    Pick<FactoryProvider<RedirectsModuleDynamicOptions>, "useFactory" | "inject">;

@Global()
@Module({})
export class RedirectsModule {
    static register({ customTargets, Scope }: RedirectsModuleOptions = {}): DynamicModule {
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

        const targetUrlServiceProvider: ClassProvider<RedirectTargetUrlServiceInterface> = {
            provide: REDIRECTS_TARGET_URL_SERVICE,
            useClass: DefaultRedirectTargetUrlService,
        };

        const mikroOrmModule = MikroOrmModule.forFeature([Redirect]);

        return {
            module: RedirectsModule,
            imports: [mikroOrmModule],
            providers: [
                RedirectsResolver,
                RedirectsDependenciesResolver,
                RedirectsService,
                linkBlockProvider,
                ImportRedirectsConsole,
                targetUrlServiceProvider,
            ],
            exports: [RedirectsService, REDIRECTS_LINK_BLOCK, mikroOrmModule],
        };
    }

    static registerAsync({ customTargets, Scope, ...dynamicOptions }: RedirectsModuleAsyncOptions): DynamicModule {
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

        const optionsProvider: FactoryProvider<RedirectsModuleDynamicOptions> = {
            provide: "redirects-dynamic-options",
            ...dynamicOptions,
        };

        const targetUrlServiceProvider: FactoryProvider<RedirectTargetUrlServiceInterface | Type<RedirectTargetUrlServiceInterface>> = {
            provide: REDIRECTS_TARGET_URL_SERVICE,
            useFactory: (options: RedirectsModuleDynamicOptions) => options.targetUrlService ?? DefaultRedirectTargetUrlService,
            inject: ["redirects-dynamic-options"],
        };

        return {
            module: RedirectsModule,
            imports: [...(dynamicOptions.imports ?? []), mikroOrmModule],
            providers: [
                optionsProvider,
                linkBlockProvider,
                RedirectsResolver,
                RedirectsDependenciesResolver,
                RedirectsService,
                ImportRedirectsConsole,
                targetUrlServiceProvider,
            ],
            exports: [RedirectsService, REDIRECTS_LINK_BLOCK, mikroOrmModule],
        };
    }
}
