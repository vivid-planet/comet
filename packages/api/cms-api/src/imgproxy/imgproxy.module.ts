import { DynamicModule, Global, Module, ValueProvider } from "@nestjs/common";

import { IMGPROXY_CONFIG } from "./imgproxy.constants";
import { ImgproxyConfig, ImgproxyService } from "./imgproxy.service";

interface ImgproxyModuleOptions {
    imgproxyConfig: ImgproxyConfig;
}

@Global()
@Module({})
export class ImgproxyModule {
    static register({ imgproxyConfig }: ImgproxyModuleOptions): DynamicModule {
        const imgproxyConfigProvider: ValueProvider<ImgproxyConfig> = {
            provide: IMGPROXY_CONFIG,
            useValue: imgproxyConfig,
        };

        return {
            module: ImgproxyModule,
            imports: [],
            providers: [imgproxyConfigProvider, ImgproxyService],
            exports: [ImgproxyService],
        };
    }
}
