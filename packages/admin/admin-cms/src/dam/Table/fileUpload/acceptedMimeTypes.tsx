import { GQLFileCategory } from "../../../graphql.generated";

// this mimetype list is a duplicate of api/api-cms/src/dam/files/files.controller.ts
// if you change this file, change the api file too

type AcceptedMimeTypes = {
    [key in GQLFileCategory]: string[];
};

export const acceptedMimeTypesByCategory: AcceptedMimeTypes = {
    SVG_IMAGE: ["image/svg+xml"],
    PIXEL_IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/tiff", "image/psd", "image/vnd.microsoft.icon", "image/bmp"],
    AUDIO: ["audio/mpeg", "audio/mp3", "audio/ogg", "audio/wav"],
    VIDEO: ["video/mp4", "video/quicktime", "video/ogg", "video/avi", "video/x-m4v", "video/webm"],
    OTHER: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.oasis.opendocument.text",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/vnd.oasis.opendocument.spreadsheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint",
        "application/vnd.oasis.opendocument.presentation",
        "application/x-zip-compressed",
        "application/zip",
        ...(process.env.DAM_ADDITIONAL_MIMETYPES?.split(",") ?? []),
    ],
};

export const acceptedMimeTypes = Object.values(acceptedMimeTypesByCategory).reduce<string[]>((prev, mimetypes) => [...prev, ...mimetypes], []);
