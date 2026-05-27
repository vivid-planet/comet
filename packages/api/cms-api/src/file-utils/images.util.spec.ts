import { describe, expect, it } from "vitest";

import { FocalPoint } from "./focal-point.enum";
import { getCenteredPosition, getMaxDimensionsFromArea, getSupportedMimeType } from "./images.util";

describe("getMaxDimensionsFromArea", () => {
    it("returns correct dimensions for a landscape aspect ratio (>= 1)", () => {
        const result = getMaxDimensionsFromArea({ width: 100, height: 50 }, 2);
        expect(result).toEqual({ width: 100, height: 50 });
    });

    it("returns correct dimensions for a portrait aspect ratio (< 1)", () => {
        const result = getMaxDimensionsFromArea({ width: 100, height: 200 }, 0.5);
        expect(result).toEqual({ width: 100, height: 200 });
    });

    it("returns correct dimensions for a square aspect ratio (= 1)", () => {
        const result = getMaxDimensionsFromArea({ width: 100, height: 100 }, 1);
        expect(result).toEqual({ width: 100, height: 100 });
    });

    it("constrains width when portrait ratio would exceed area width", () => {
        // area 50x200, ratio 0.5: width = min(200 * 0.5, 50) = 50 → limited by area.width
        const result = getMaxDimensionsFromArea({ width: 50, height: 200 }, 0.5);
        expect(result).toEqual({ width: 50, height: 100 });
    });

    it("constrains height when landscape ratio would exceed area height", () => {
        // area 200x50, ratio 2: height = min(200 / 2, 50) = 50 → limited by area.height
        const result = getMaxDimensionsFromArea({ width: 200, height: 50 }, 2);
        expect(result).toEqual({ width: 100, height: 50 });
    });

    it("rounds up fractional dimensions with Math.ceil", () => {
        // ratio 3 (landscape): height = min(100/3, 100) = 33.33 → ceil to 34; width = ceil(33.33 * 3) = ceil(100) = 100
        const result = getMaxDimensionsFromArea({ width: 100, height: 100 }, 3);
        expect(result).toEqual({ width: 100, height: 34 });
    });
});

describe("getCenteredPosition", () => {
    it("centers crop around CENTER focal point", () => {
        const area = { x: 0, y: 0, width: 100, height: 100 };
        const crop = { width: 50, height: 50 };
        const result = getCenteredPosition(crop, area, FocalPoint.CENTER);
        expect(result).toEqual({ x: 25, y: 25 });
    });

    it("positions crop around NORTHWEST focal point", () => {
        // focalPoint = (90/3=30, 90/3=30), crop 30x30: x = max(30-15,0)=15, y=15
        const area = { x: 0, y: 0, width: 90, height: 90 };
        const crop = { width: 30, height: 30 };
        const result = getCenteredPosition(crop, area, FocalPoint.NORTHWEST);
        expect(result).toEqual({ x: 15, y: 15 });
    });

    it("positions crop around SOUTHEAST focal point", () => {
        // focalPoint = (90-30=60, 60), crop 30x30: x = max(60-15,0)=45, y=45
        const area = { x: 0, y: 0, width: 90, height: 90 };
        const crop = { width: 30, height: 30 };
        const result = getCenteredPosition(crop, area, FocalPoint.SOUTHEAST);
        expect(result).toEqual({ x: 45, y: 45 });
    });

    it("clamps crop to top-left when focal point is near top-left and crop is large", () => {
        // focalPoint NORTHWEST: (100/3≈33.3, 33.3), crop 80x80: x=max(33.3-40,0)=0, y=0
        const area = { x: 0, y: 0, width: 100, height: 100 };
        const crop = { width: 80, height: 80 };
        const result = getCenteredPosition(crop, area, FocalPoint.NORTHWEST);
        expect(result).toEqual({ x: 0, y: 0 });
    });

    it("clamps crop to bottom-right when focal point is near bottom-right and crop is large", () => {
        // focalPoint SOUTHEAST on 100x100: (66.7, 66.7), crop 80x80
        // x = max(66.7-40,0)=26.7; 26.7+80=106.7>100 → x -= 6.7 → 20; y same
        const area = { x: 0, y: 0, width: 100, height: 100 };
        const crop = { width: 80, height: 80 };
        const result = getCenteredPosition(crop, area, FocalPoint.SOUTHEAST);
        expect(result.x).toBe(20);
        expect(result.y).toBe(20);
    });

    it("adds area offset to result coordinates", () => {
        const area = { x: 10, y: 20, width: 100, height: 100 };
        const crop = { width: 50, height: 50 };
        const result = getCenteredPosition(crop, area, FocalPoint.CENTER);
        // centered at (25,25) relative to area, plus offset (10,20)
        expect(result).toEqual({ x: 35, y: 45 });
    });
});

describe("getSupportedMimeType", () => {
    it("returns the matching mime type when the accept header contains a supported type", () => {
        const result = getSupportedMimeType(["image/jpeg"], "image/webp, image/jpeg");
        expect(result).toBe("image/jpeg");
    });

    it("returns empty string when accept header is empty", () => {
        const result = getSupportedMimeType(["image/webp", "image/jpeg"], "");
        expect(result).toBe("");
    });

    it("returns empty string when accept header does not include any supported type", () => {
        const result = getSupportedMimeType(["image/webp"], "image/png");
        expect(result).toBe("");
    });
});
