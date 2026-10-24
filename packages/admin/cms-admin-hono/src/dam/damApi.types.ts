import type { InferResponseType } from "hono/client";

import type { DamApiClient } from "./DamApiProvider";

export type DamItem = InferResponseType<DamApiClient["items"]["$get"], 200>["nodes"][number];
export type DamFileItem = Extract<DamItem, { __typename: "DamFile" }>;
export type DamFolderItem = Extract<DamItem, { __typename: "DamFolder" }>;
export type DamFileDetails = InferResponseType<DamApiClient["files"][":id"]["$get"], 200>;
type DamImage = NonNullable<DamFileItem["image"]>;

export const damQueryKeys = {
    all: ["dam"] as const,
    items: (query: object) => ["dam", "items", query] as const,
    folder: (id: string | undefined) => ["dam", "folder", id] as const,
    file: (id: string) => ["dam", "file", id] as const,
};

/**
 * Uses the aspect ratio of the image's crop area, which the API accepts for every allowed width.
 */
export function createImageUrl(image: Pick<DamImage, "urlTemplate" | "width" | "height" | "cropArea">, width: number): string {
    const { cropArea } = image;
    const aspectRatio =
        cropArea.focalPoint === "SMART" || !cropArea.width || !cropArea.height
            ? image.width / image.height
            : (cropArea.width * image.width) / (cropArea.height * image.height);
    return image.urlTemplate.replace("$resizeWidth", String(width)).replace("$resizeHeight", String(Math.ceil(width / aspectRatio)));
}
