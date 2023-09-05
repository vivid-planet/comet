import { XMLParser } from "fast-xml-parser";
import FileType from "file-type";
import fs from "fs";
import got from "got";
import os from "os";
import { sep } from "path";
import slugify from "slugify";
import stream from "stream";
import { promisify } from "util";
import { v4 as uuid } from "uuid";

import { FileUploadInterface } from "./dto/file-upload.interface";
import { FilesService } from "./files.service";

export function slugifyFilename(filename: string, extension: string): string {
    return `${slugify(filename, { locale: "de", lower: true, strict: true })}${extension}`;
}

const pipeline = promisify(stream.pipeline);
export async function download(url: string): Promise<FileUploadInterface> {
    const tempDir = fs.mkdtempSync(`${os.tmpdir()}/download`);
    const fakeName = uuid();
    const tempFile = `${tempDir}/${fakeName}`;

    if (url.substr(0, 4) === "http") {
        await pipeline(got.stream(url), fs.createWriteStream(tempFile));
    } else {
        fs.copyFileSync(url, tempFile);
    }

    const fileType = await FileType.fromFile(tempFile);
    const stats = fs.statSync(tempFile);
    const filename = url.substring(url.lastIndexOf("/") + 1);

    return {
        fieldname: FilesService.UPLOAD_FIELD,
        originalname: `${filename}.${fileType?.ext}`,
        encoding: "utf8",
        mimetype: fileType?.mime as string,
        size: stats.size,
        destination: tempDir,
        filename: fakeName,
        path: tempFile,
    };
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
