import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ImageFormat } from "../../../file-utils/image-format.enum";
import { ImageParams } from "./image.params";

// Skipping missing properties validates only `format`: the image size validators need the DAM config from the Nest container.
async function getFormatValidationErrors(format: string) {
    const errors = await validate(plainToInstance(ImageParams, { format }), { skipMissingProperties: true });
    return errors.filter((error) => error.property === "format");
}

describe("ImageParams.format", () => {
    it("accepts the original format", async () => {
        expect(await getFormatValidationErrors(ImageFormat.original)).toHaveLength(0);
    });

    it("rejects an unknown format", async () => {
        expect(await getFormatValidationErrors("webp")).toHaveLength(1);
    });
});
