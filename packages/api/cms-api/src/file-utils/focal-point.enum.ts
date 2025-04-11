import { registerEnumType } from "@nestjs/graphql";

export enum FocalPoint {
    SMART = "SMART", // libvips detects the most "interesting" section of the image and considers it as the center of the resulting image;
    CENTER = "CENTER", // default
    NORTHWEST = "NORTHWEST", // (top-left corner);
    NORTHEAST = "NORTHEAST", // (top-right corner);
    SOUTHWEST = "SOUTHWEST", // (bottom-left corner);
    SOUTHEAST = "SOUTHEAST", // (bottom-right corner);
}
registerEnumType(FocalPoint, { name: "FocalPoint" });
