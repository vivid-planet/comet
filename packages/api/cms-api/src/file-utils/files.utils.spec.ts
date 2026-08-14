import { describe, expect, it } from "vitest";

import { isValidSvg } from "./files.utils";

describe("Files Utils", () => {
    describe("isValidSvg", () => {
        it("should return true if the svg doesn't contain any forbidden content", async () => {
            const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#242424" fill-rule="evenodd" d=""/>
            </svg>`;

            expect(await isValidSvg(cleanSvg)).toBe(true);
        });

        it("should return false if the svg contains a script tag", async () => {
            const svgWithScriptTag = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#242424" fill-rule="evenodd" d=""/>
                <script type="text/javascript">
                    alert("XSS");
                </script>
            </svg>`;

            expect(await isValidSvg(svgWithScriptTag)).toBe(false);
        });

        it("should return false if the svg contains an event handler", async () => {
            const svgWithOnloadHandler = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path onload="alert('XSS');" fill="#242424" fill-rule="evenodd" d=""/>
            </svg>`;

            expect(await isValidSvg(svgWithOnloadHandler)).toBe(false);
        });

        it("should return false if the svg contains a href attribute containing javascript", async () => {
            const svgWithOnloadHandler = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <a href="javascript:alert(1)">
                <path onload="alert('XSS');" fill="#242424" fill-rule="evenodd" d=""/>
                </a>
            </svg>`;

            expect(await isValidSvg(svgWithOnloadHandler)).toBe(false);
        });

        it("should return false if the svg contains a script tag with a namespace prefix", async () => {
            const svgWithNamespacedScriptTag = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xhtml" width="16" height="16" viewBox="0 0 16 16">
                <x:script>alert("XSS");</x:script>
            </svg>`;

            expect(await isValidSvg(svgWithNamespacedScriptTag)).toBe(false);
        });

        it("should return false if the svg contains an uppercase href attribute containing javascript", async () => {
            const svgWithUppercaseHref = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <a XLINK:HREF="javascript:alert(1)">
                <path fill="#242424" fill-rule="evenodd" d=""/>
                </a>
            </svg>`;

            expect(await isValidSvg(svgWithUppercaseHref)).toBe(false);
        });

        it("should return true if the svg contains a role attribute", async () => {
            const svgWithRole = `<svg xmlns="http://www.w3.org/2000/svg" role="img" width="16" height="16" viewBox="0 0 16 16">
                <path role="presentation" fill="#242424" fill-rule="evenodd" d=""/>
            </svg>`;

            expect(await isValidSvg(svgWithRole)).toBe(true);
        });

        it("should return true if the svg contains a use element with a same-document fragment reference", async () => {
            const svgWithFragmentUse = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                <defs><path id="icon" d=""/></defs>
                <use xlink:href="#icon" mask="url(#mask0)" transform="matrix(1,0,0,1,0,0)"/>
            </svg>`;

            expect(await isValidSvg(svgWithFragmentUse)).toBe(true);
        });

        it("should return false if the svg contains a use element referencing an external resource", async () => {
            const svgWithExternalUse = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <use href="https://evil.example.com/payload.svg#icon"/>
            </svg>`;

            expect(await isValidSvg(svgWithExternalUse)).toBe(false);
        });
    });
});
