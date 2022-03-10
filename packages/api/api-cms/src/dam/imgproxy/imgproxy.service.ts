import { Inject, Injectable } from "@nestjs/common";
import base64url from "base64url";
import { createHmac } from "crypto";

import { IMGPROXY_CONFIG } from "../dam.constants";
import { ImgproxyBuilder } from "./imgproxy.builder";

export interface ImgproxyConfig {
    url: string;
    salt: string;
    key: string;
    quality: number;
    maxSrcResolution: number;
}

@Injectable()
export class ImgproxyService {
    url = this.config.url;
    salt = this.config.salt;
    key = this.config.key;

    constructor(@Inject(IMGPROXY_CONFIG) private readonly config: ImgproxyConfig) {}

    builder(): ImgproxyBuilder {
        return new ImgproxyBuilder(this.config.quality);
    }

    getSignedUrl(path: string): string {
        return `${this.url}/${this.sign(path)}${path}`;
    }

    sign(target: string): string {
        const hmac = createHmac("sha256", Buffer.from(this.key, "hex"));
        hmac.update(Buffer.from(this.salt, "hex"));
        hmac.update(target);
        return base64url(hmac.digest());
    }
}
