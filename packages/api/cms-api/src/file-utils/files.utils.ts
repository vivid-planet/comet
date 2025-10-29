import { XMLParser } from "fast-xml-parser";
import FileType from "file-type";
import fs from "fs";
import { unlink } from "fs/promises";
import * as mimedb from "mime-db";
import os from "os";
import { basename, extname } from "path";
import slugify from "slugify";
import stream from "stream";
import { promisify } from "util";
import { v4 as uuid } from "uuid";

import { type FileUploadInput } from "./file-upload.input";
import { FILE_UPLOAD_FIELD } from "./files.constants";

const pipeline = promisify(stream.pipeline);

export function slugifyFilename(filename: string, extension: string): string {
    const extensionWithDot = extension.startsWith(".") ? extension : `.${extension}`;
    return `${slugify(filename)}${extensionWithDot}`;
}

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

const disallowedSvgTags = [
    "script", // can lead to XSS
    "foreignObject", // can embed non-SVG content
    "image", // can load external resources
    "animate", // can modify attributes; resource exhaustion
    "animateMotion", // can modify attributes; resource exhaustion
    "animateTransform", // can modify attributes; resource exhaustion
    "set", // can modify attributes
];

const recursiveIsValidSvgNode = (node: SvgNode): boolean => {
    if (typeof node === "string") {
        // is plain text -> can't contain JS
        return true;
    }

    for (const [tagOrAttributeName, value] of Object.entries(node)) {
        const containsDisallowedTags = disallowedSvgTags.some((tag) => tag.toLowerCase() === tagOrAttributeName.toLowerCase());

        const containsEventHandler = tagOrAttributeName.toLowerCase().startsWith("on"); // can execute JavaScript

        const containsHref = // can execute JavaScript or link to malicious targets
            ["href", "xlink:href"].includes(tagOrAttributeName) &&
            typeof value === "string" &&
            (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("javascript:"));

        if (containsDisallowedTags || containsEventHandler || containsHref) {
            return false;
        }

        // is node -> children can contain JS
        const children = node[tagOrAttributeName];
        const childrenAreValid = recursiveIsValidSvgNode(children);

        if (!childrenAreValid) {
            return false;
        }
    }

    return true;
};

export const isValidSvg = (svg: string) => {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const jsonObj = parser.parse(svg) as SvgNode;

    return recursiveIsValidSvgNode(jsonObj);
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

export async function createFileUploadInputFromUrl(url: string): Promise<FileUploadInput> {
    const tempDir = fs.mkdtempSync(`${os.tmpdir()}/download`);
    const fakeName = uuid();
    const tempFile = `${tempDir}/${fakeName}`;

    if (url.substring(0, 4) === "http") {
        const response = await fetch(url);
        if (!response.ok || !response.body) {
            throw new Error(`Failed to fetch file from URL: ${url}`);
        }
        const fileStream = fs.createWriteStream(tempFile);
        await pipeline(response.body, fileStream);
        //TODO when downloading the file from http use mime type from response header
    } else {
        fs.copyFileSync(url, tempFile);
    }

    const fileType = await FileType.fromFile(tempFile);
    const stats = fs.statSync(tempFile); // TODO don't use sync
    const filenameWithoutExtension = basename(url, extname(url));

    return {
        fieldname: FILE_UPLOAD_FIELD,
        originalname: `${filenameWithoutExtension}.${fileType?.ext}`,
        encoding: "utf8",
        mimetype: fileType?.mime as string,
        size: stats.size,
        destination: tempDir,
        filename: fakeName,
        path: tempFile,
    };
}
