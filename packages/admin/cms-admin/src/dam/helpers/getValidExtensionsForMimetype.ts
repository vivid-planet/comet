import * as mimedb from "mime-db";

export const getValidExtensionsForMimetype = (mimetype: string) => {
    let supportedExtensions: readonly string[] | undefined;
    if (mimetype === "application/x-zip-compressed") {
        // zip files in Windows, not supported by mime-db
        // see https://github.com/jshttp/mime-db/issues/245
        supportedExtensions = ["zip"];
    } else {
        supportedExtensions = mimedb[mimetype]?.extensions;
    }

    return supportedExtensions;
};
