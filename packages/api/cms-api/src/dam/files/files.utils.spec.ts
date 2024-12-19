import { isValidSvg } from "./files.utils";

describe("Files Utils", () => {
    describe("isValidSvg", () => {
        it("should return true if the svg doesn't contain any forbidden content", async () => {
            const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#242424" fill-rule="evenodd" d=""/>
            </svg>`;

            expect(isValidSvg(cleanSvg)).toBe(true);
        });

        it("should return false if the svg contains a script tag", async () => {
            const svgWithScriptTag = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#242424" fill-rule="evenodd" d=""/>
                <script type="text/javascript">
                    alert("XSS");
                </script>
            </svg>`;

            expect(isValidSvg(svgWithScriptTag)).toBe(false);
        });

        it("should return false if the svg contains an event handler", async () => {
            const svgWithOnloadHandler = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path onload="alert('XSS');" fill="#242424" fill-rule="evenodd" d=""/>
            </svg>`;

            expect(isValidSvg(svgWithOnloadHandler)).toBe(false);
        });

        it("should return false if the svg contains a href attribute containing javascript", async () => {
            const svgWithOnloadHandler = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <a href="javascript:alert(1)">
                <path onload="alert('XSS');" fill="#242424" fill-rule="evenodd" d=""/>
                </a>
            </svg>`;

            expect(isValidSvg(svgWithOnloadHandler)).toBe(false);
        });
    });
});
