import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ConfigProvider } from "../../../config/ConfigProvider.js";
import { usePixelImageConfig } from "../usePixelImageConfig.js";

function ConfigProbe() {
    usePixelImageConfig();
    return null;
}

describe("usePixelImageConfig", () => {
    it("throws when config.pixelImageBlock is unset", () => {
        expect(() => renderToStaticMarkup(<ConfigProbe />)).toThrowError(/`pixelImageBlock` must be set/);
    });

    it("error message points at MjmlMailRoot and ConfigProvider", () => {
        expect(() => renderToStaticMarkup(<ConfigProbe />)).toThrowError(/MjmlMailRoot/);
        expect(() => renderToStaticMarkup(<ConfigProbe />)).toThrowError(/ConfigProvider/);
    });

    it("does not throw when config.pixelImageBlock is provided", () => {
        expect(() =>
            renderToStaticMarkup(
                <ConfigProvider config={{ pixelImageBlock: { validSizes: [640, 1280], baseUrl: "http://localhost:3000" } }}>
                    <ConfigProbe />
                </ConfigProvider>,
            ),
        ).not.toThrow();
    });
});
