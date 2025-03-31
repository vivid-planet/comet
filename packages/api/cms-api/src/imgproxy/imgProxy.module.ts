import { DynamicModule, Global, Module, ValueProvider } from "@nestjs/common";

import { IMGPROXY_CONFIG } from "./imgproxy.constants";
import { ImgproxyConfig, ImgproxyService } from "./imgproxy.service";

interface ImgProxyModuleOptions {
    imgproxyConfig: ImgproxyConfig;
}

@Global()
@Module({})
export class ImgProxyModule {
    static register({ imgproxyConfig }: ImgProxyModuleOptions): DynamicModule {
        const imgproxyConfigProvider: ValueProvider<ImgproxyConfig> = {
            provide: IMGPROXY_CONFIG,
            useValue: imgproxyConfig,
        };

        return {
            module: ImgProxyModule,
            imports: [],
            providers: [imgproxyConfigProvider, ImgproxyService],
            exports: [ImgproxyService],
        };
    }
}
