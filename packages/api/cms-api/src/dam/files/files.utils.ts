import { XMLParser } from "fast-xml-parser";
import FileType from "file-type";
import fs from "fs";
import { unlink } from "fs/promises";
import got from "got";
import isSvg from "is-svg";
import * as mimedb from "mime-db";
import os from "os";
import { basename, extname } from "path";
import slugify from "slugify";
import stream from "stream";
import { promisify } from "util";
import { v4 as uuid } from "uuid";

import { FileUploadInput } from "./dto/file-upload.input";
import { FilesService } from "./files.service";

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

export async function createFileUploadInputFromUrl(url: string): Promise<FileUploadInput> {
    const tempDir = fs.mkdtempSync(`${os.tmpdir()}/download`);
    const fakeName = uuid();
    const tempFile = `${tempDir}/${fakeName}`;

    if (url.substring(0, 4) === "http") {
        await pipeline(got.stream(url), fs.createWriteStream(tempFile));
        //TODO when downloading the file from http use mime type from response header
    } else {
        fs.copyFileSync(url, tempFile);
    }

    const stats = fs.statSync(tempFile); // TODO don't use sync
    const filenameWithoutExtension = basename(url, extname(url));

    const fileType = await FileType.fromFile(tempFile);
    let determinedMimetype: string | undefined = fileType?.mime;
    let determinedExtension: string | undefined = fileType?.ext;

    if (determinedMimetype === "application/xml") {
        // could be svg because it's not supported by the file-type library
        if (isSvg(fs.readFileSync(tempFile, "utf8"))) {
            determinedMimetype = "image/svg+xml";
            determinedExtension = "svg";
        }
    }

    if (determinedMimetype === undefined || determinedExtension === undefined) {
        throw new Error("Mimetype or extension could not be determined");
    }

    return {
        fieldname: FilesService.UPLOAD_FIELD,
        originalname: `${filenameWithoutExtension}.${determinedExtension}`,
        encoding: "utf8",
        mimetype: determinedMimetype,
        size: stats.size,
        destination: tempDir,
        filename: fakeName,
        path: tempFile,
    };
}
