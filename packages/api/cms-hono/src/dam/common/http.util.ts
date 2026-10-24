import { timingSafeEqual } from "node:crypto";

import type { DamScope } from "../db/dam.schema.js";

export function contentDisposition(type: "inline" | "attachment", filename: string): string {
    const asciiFilename = filename.replace(/[^\x20-\x7e]|["\\]/g, "_");
    return `${type}; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export function isValidHash(hash: string, expectedHash: string): boolean {
    const hashBuffer = Buffer.from(hash);
    const expectedHashBuffer = Buffer.from(expectedHash);
    return hashBuffer.length === expectedHashBuffer.length && timingSafeEqual(hashBuffer, expectedHashBuffer);
}

export function scopesAreEqual(scope: DamScope | undefined, otherScope: DamScope | undefined): boolean {
    const keys = new Set([...Object.keys(scope ?? {}), ...Object.keys(otherScope ?? {})]);
    return [...keys].every((key) => scope?.[key] === otherScope?.[key]);
}
