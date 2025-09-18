import { Inject, Injectable } from "@nestjs/common";
import { createHmac } from "crypto";

import { ImgproxyBuilder } from "./imgproxy.builder.js";
import { IMGPROXY_CONFIG } from "./imgproxy.constants.js";

export interface ImgproxyConfig {
    url: string;
    salt: string;
    key: string;
    quality: number;
}

@Injectable()
export class ImgproxyService {
    constructor(@Inject(IMGPROXY_CONFIG) private readonly config: ImgproxyConfig) {}

    builder(): ImgproxyBuilder {
        return new ImgproxyBuilder(this.config.quality);
    }

    getSignedUrl(path: string): string {
        return `${this.config.url}/${this.sign(path)}${path}`;
    }

    sign(target: string): string {
        const hmac = createHmac("sha256", Buffer.from(this.config.key, "hex"));
        hmac.update(Buffer.from(this.config.salt, "hex"));
        hmac.update(target);
        return Buffer.from(hmac.digest()).toString("base64url");
    }
}
