import { readClipboardText } from "@comet/admin";
import { type z } from "zod";

export const getClipboardValueForSchema = async <T>(schema: z.ZodSchema<T>): Promise<T | null> => {
    const clipboardData = await readClipboardText();

    if (!clipboardData) {
        return null;
    }

    let jsonClipboardData;
    try {
        jsonClipboardData = JSON.parse(clipboardData);
    } catch {
        return null;
    }

    const validatedClipboardData = schema.safeParse(jsonClipboardData);

    if (!validatedClipboardData.success) {
        return null;
    }

    return validatedClipboardData.data;
};
