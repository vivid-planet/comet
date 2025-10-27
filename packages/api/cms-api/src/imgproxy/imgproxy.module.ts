import { DynamicModule, Global, Module, ValueProvider } from "@nestjs/common";

import { IMGPROXY_CONFIG } from "./imgproxy.constants";
import { type ImgproxyConfig, ImgproxyService } from "./imgproxy.service";

@Global()
@Module({})
export class ImgproxyModule {
    static register(imgproxyConfig: ImgproxyConfig): DynamicModule {
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
