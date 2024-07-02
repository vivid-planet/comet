import { XMLParser } from "fast-xml-parser";
import { unlink } from "fs/promises";
import * as mimedb from "mime-db";
import { sep } from "path";
import slugify from "slugify";

import { FileUploadInput } from "./dto/file-upload.input";

export function slugifyFilename(filename: string, extension?: string): string {
    const extensionWithDot = extension === undefined ? "" : extension.startsWith(".") ? extension : `.${extension}`;
    return `${slugify(filename)}${extensionWithDot}`;
}

export const createHashedPath = (contentHash: string): string => [contentHash.substr(0, 2), contentHash.substr(2, 2), contentHash].join(sep);

export const calculatePartialRanges = (size: number, range: string): { start: number; end: number; contentLength: number } => {
    let [start, end] = range.replace(/bytes=/, "").split("-") as Array<string | number>;
    start = parseInt(start as string, 10);
    end = end ? parseInt(end as string, 10) : size - 1;

    if (!isNaN(start) && isNaN(end)) {
        // eslint-disable-next-line no-self-assign
        start = start;
        end = size - 1;
    }
    if (isNaN(start) && !isNaN(end)) {
        start = size - end;
        end = size - 1;
    }

    return {
        start,
        end,
        contentLength: end - start + 1,
    };
};

type SvgNode =
    | string
    | {
          [key: string]: SvgNode;
      };

const recursivelyFindJSInSvg = (node: SvgNode): boolean => {
    if (typeof node === "string") {
        // is plain text -> can't contain JS
        return false;
    }

    for (const tagOrAttr of Object.keys(node)) {
        if (tagOrAttr.toLowerCase() === "script" || tagOrAttr.toLowerCase().startsWith("on")) {
            // is script tag or event handler
            return true;
        }

        // is node -> children can contain JS
        const children = node[tagOrAttr];
        const childrenContainJS = recursivelyFindJSInSvg(children);
        if (childrenContainJS) {
            return true;
        }
    }

    return false;
};

export const svgContainsJavaScript = (svg: string) => {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const jsonObj = parser.parse(svg) as SvgNode;

    return recursivelyFindJSInSvg(jsonObj);
};

export const removeMulterTempFile = async (file: FileUploadInput) => {
    // https://github.com/expressjs/multer/blob/master/storage/disk.js#L54-L62
    const path = file.path;

    delete (file as Partial<FileUploadInput>).destination;
    delete (file as Partial<FileUploadInput>).filename;
    delete (file as Partial<FileUploadInput>).path;

    await unlink(path);
};

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
