import { registerEnumType } from "@nestjs/graphql";

export enum FileCategory {
    PIXEL_IMAGE = "PIXEL_IMAGE",
    SVG_IMAGE = "SVG_IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    OTHER = "OTHER",
}
registerEnumType(FileCategory, { name: "FileCategory" });
