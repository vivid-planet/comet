import { parseResponse } from "hono/client";

import type { DamFileItem } from "../damApi.types.js";
import { createDamApiClient } from "../DamApiProvider.js";

/** The file a block references, as the admin shows it. Blocks store only its ID. */
export type DamBlockFile = Omit<DamFileItem, "__typename">;

export type DamImageCropArea = NonNullable<DamBlockFile["image"]>["cropArea"];

/**
 * Loads the file of a block in `output2State`, which only gets the block context. A deleted file leaves the block empty, like an image
 * that was never chosen.
 */
export async function loadDamBlockFile(apiUrl: string, id: string): Promise<DamBlockFile | undefined> {
    const response = await createDamApiClient(apiUrl).files[":id"].$get({ param: { id } });
    if (response.status === 404) {
        return undefined;
    }
    return parseResponse(response);
}
