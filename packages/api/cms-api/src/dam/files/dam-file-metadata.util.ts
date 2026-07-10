import exifr from "exifr";
import { createReadStream } from "fs";
import * as hasha from "hasha";
import probe from "probe-image-size";

import type { FileUploadInput } from "../../file-utils/file-upload.input";
import { CometImageResolutionException } from "../common/errors/image-resolution.exception";

const exifrSupportedMimetypes = ["image/jpeg", "image/tiff", "image/x-iiq", "image/heif", "image/heic", "image/avif", "image/png"];

export async function calculateHashForFile(filePath: string): Promise<string> {
    return hasha.fromFile(filePath, { algorithm: "md5" });
}

export interface FileMetadataForUpload {
    exifData: Record<string, string | number | Uint8Array | number[] | Uint16Array> | undefined;
    contentHash: string;
    image: probe.ProbeResult | undefined;
}

export async function getFileMetadataForUpload(
    file: FileUploadInput,
    { maxSrcResolution }: { maxSrcResolution: number },
): Promise<FileMetadataForUpload> {
    const contentHash = await calculateHashForFile(file.path);
    let image: probe.ProbeResult | undefined;
    try {
        image = await probe(createReadStream(file.path));
        if (image.type == "svg") {
            image = undefined;
        }
        if (image !== undefined && image.orientation !== undefined && [6, 8].includes(image.orientation)) {
            image = {
                ...image,
                width: image.height,
                height: image.width,
            };
        }
    } catch {
        // empty
    }

    if (image !== undefined && image.width && image.height && Math.round(((image.width * image.height) / 1000000) * 10) / 10 >= maxSrcResolution) {
        throw new CometImageResolutionException(`Maximal image resolution exceeded`);
    }

    let exifData: Record<string, string | number | Uint8Array | number[] | Uint16Array> | undefined;
    if (exifrSupportedMimetypes.includes(file.mimetype)) {
        try {
            exifData = await exifr.parse(file.path);
        } catch {
            // empty
        }
    }

    return { exifData, contentHash, image };
}
