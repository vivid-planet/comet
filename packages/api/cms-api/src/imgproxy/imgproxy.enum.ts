export enum ResizingType {
    FIT = "fit",
    FILL = "fill",
    AUTO = "auto",
}

export enum Gravity {
    CENTER = "ce", // default
    NORTH = "no", // (top edge);
    SOUTH = "so", // (bottom edge);
    EAST = "ea", // (right edge);
    WEST = "we", // (left edge);
    NORTHEAST = "noea", // (top-right corner);
    NORTHWEST = "nowe", // (top-left corner);
    SOUTHEAST = "soea", // (bottom-right corner);
    SOUTHWEST = "sowe", // (bottom-left corner);
    SMART = "sm", // libvips detects the most "interesting" section of the image and considers it as the center of the resulting image;
}

export enum Extension {
    JPG = "jpg",
    PNG = "png",
    WEBP = "webp",
    // AVIF = "avif",
    GIF = "gif",
    ICO = "ico",
    TIFF = "tiff",
}
