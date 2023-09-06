import { svgContainsJavaScript } from "./files.utils";

describe("Files Utils", () => {
    describe("svgContainsJavaScript", () => {
        it("should return false if the svg doesn't contain a script tag or event handler", async () => {
            const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#242424" fill-rule="evenodd" d=""/>
            </svg>`;

            expect(svgContainsJavaScript(cleanSvg)).toBe(false);
        });

        it("should return true if the svg contains a script tag", async () => {
            const svgWithScriptTag = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#242424" fill-rule="evenodd" d=""/>
                <script type="text/javascript">
                    alert("XSS");
                </script>
            </svg>`;

            expect(svgContainsJavaScript(svgWithScriptTag)).toBe(true);
        });

        it("should return true if the svg contains an event handler", async () => {
            const svgWithOnloadHandler = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path onload="alert('XSS');" fill="#242424" fill-rule="evenodd" d=""/>
            </svg>`;

            expect(svgContainsJavaScript(svgWithOnloadHandler)).toBe(true);
        });
    });
});
