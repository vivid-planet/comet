import { createHmac } from "node:crypto";

/** `ce`: center, `nowe`: top left corner, `sm`: libvips detects the most "interesting" section of the image */
export type ImgproxyGravity = "ce" | "nowe" | "sm";

export type ImgproxyExtension = "jpg" | "png" | "webp" | "gif";

export interface ImgproxyConfig {
    url: string;
    salt: string;
    key: string;
    quality: number;
}

export class ImgproxyBuilder {
    private readonly options: Record<string, string> = {};

    constructor(private readonly defaultQuality: number) {}

    crop({
        width,
        height,
        gravity = "ce",
        x = 0,
        y = 0,
    }: {
        width: number;
        height: number;
        gravity?: ImgproxyGravity;
        x?: number;
        y?: number;
    }): this {
        return this.setOption("crop", (gravity === "sm" ? [width, height, gravity] : [width, height, gravity, x, y]).join(":"));
    }

    resize({
        type = "auto",
        width,
        height = 0,
        enlarge = false,
    }: {
        type?: "fit" | "fill" | "auto";
        width: number;
        height?: number;
        enlarge?: boolean;
    }): this {
        return this.setOption("resize", [type, width, height, enlarge ? 1 : 0].join(":"));
    }

    quality(quality: number = this.defaultQuality): this {
        return this.setOption("quality", `${quality}`);
    }

    format(extension: ImgproxyExtension): this {
        return this.setOption("format", extension);
    }

    setOption(option: string, value: string): this {
        this.options[option] = value;
        return this;
    }

    generateUrl(sourceUrl: string): string {
        const options = Object.entries(this.options).map(([option, value]) => `${option}:${value}`);
        return `/${[...options, Buffer.from(sourceUrl).toString("base64url")].join("/")}`;
    }
}

export class ImgproxyService {
    constructor(private readonly config: ImgproxyConfig) {}

    builder(): ImgproxyBuilder {
        return new ImgproxyBuilder(this.config.quality);
    }

    getSignedUrl(path: string): string {
        return `${this.config.url}/${this.sign(path)}${path}`;
    }

    private sign(target: string): string {
        const hmac = createHmac("sha256", Buffer.from(this.config.key, "hex"));
        hmac.update(Buffer.from(this.config.salt, "hex"));
        hmac.update(target);
        return hmac.digest("base64url");
    }
}
