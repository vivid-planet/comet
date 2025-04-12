import { transformConfigFile } from "../transformConfig";

describe("transformConfig", () => {
    function parseString(sourceFileText: string) {
        return transformConfigFile("test.tsx", sourceFileText);
    }
    it("parses a simple config using defineConfig", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            export default defineConfig<GQLProduct>({
                type: "grid",
                gqlType: "Product",
            });
        `);
        expect(config).toContain("export default defineConfig<GQLProduct>({");
        expect(config).toContain('type: "grid"');
    });

    it("parses a simple static json", () => {
        const config = parseString(`
            export default {
                type: "grid",
                gqlType: "Product",
            };
        `);
        expect(config).toContain('type: "grid"');
    });

    it("parses a simple static json that uses satisfies", () => {
        const config = parseString(`
            import { GQLProduct } from "@src/graphql.generated";
            import { GeneratorConfig } from "@comet/admin-generator";

            export default {
                type: "grid",
                gqlType: "Product",
            } satisfies GeneratorConfig<GQLProduct>;
        `);
        expect(config).toContain('type: "grid"');
    });

    it("parses an arrow function", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            export default defineConfig<GQLProduct>({
                type: "form",
                fields: [{
                    name: "foo",
                    validate: () => true
                }]
            });
        `);
        expect(config).toContain('type: "form"');
        expect(config).toMatch(/validate:\s*{\s*code: "\(\) => true",\s*imports: \[\]/);
    });

    it("parses an arrow function referencing an imported component", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            import { ProductTitle } from "./ProductTitle";

            export default defineConfig<GQLProduct>({
                type: "grid",
                columns: [
                    {
                        name: "title",
                        renderCell: () => <ProductTitle />,
                    }
                ]
            });
        `);
        expect(config).toContain('type: "grid"');
        expect(config).toMatch(
            /renderCell:\s*{\s*code: "\(\) => <ProductTitle \/>",\s*imports: \[\{ name: "ProductTitle", import: ".\/ProductTitle" \}\]/,
        );
    });

    it("parses an arrow function referencing an imported component using an function body", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            import { ProductTitle } from "./ProductTitle";

            export default defineConfig<GQLProduct>({
                type: "grid",
                columns: [
                    {
                        name: "title",
                        renderCell: () => { return <ProductTitle /> },
                    }
                ]
            });
        `);
        expect(config).toContain('type: "grid"');
        expect(config).toMatch(
            /renderCell:\s*{\s*code: "\(\) => \{ return <ProductTitle \/> \}",\s*imports: \[\{ name: "ProductTitle", import: ".\/ProductTitle" \}\]/,
        );
    });

    it("parses a reference to a locally defined variable", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            const abc = 123;

            export default defineConfig<GQLProduct>({
                foo: abc
            });
        `);
        expect(config).toContain("foo: abc"); //unchanged
    });

    it("parser throws error for function at unsupported location", () => {
        expect(() => {
            parseString(`
                import { defineConfig } from "@comet/admin-generator";
                import { GQLProduct } from "@src/graphql.generated";
        
                export default defineConfig<GQLProduct>({
                    foo: () => true
                });
            `);
        }).toThrow();
    });

    it("parser throws error for import at unsupported location", () => {
        expect(() => {
            parseString(`
                import { defineConfig } from "@comet/admin-generator";
                import { GQLProduct } from "@src/graphql.generated";

                import { Foo } from "./Foo";
        
                export default defineConfig<GQLProduct>({
                    foo: Foo
                });
            `);
        }).toThrow();
    });

    it("doesn't transform a function call", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            import { foo } from "./foo";

            export default defineConfig<GQLProduct>({
                type: "grid",
                columns: [
                    {
                        name: foo(),
                    }
                ]
            });
        `);
        expect(config).toContain('type: "grid"');
        expect(config).toContain("name: foo()");
    });

    it("doesn't transform a imported function call with an arrow function", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            import { foo } from "./foo";

            export default defineConfig<GQLProduct>({
                type: "grid",
                columns: [
                    {
                        name: foo(() => true),
                    }
                ]
            });
        `);
        expect(config).toContain('type: "grid"');
        expect(config).toContain("name: foo(() => true)");
    });

    it("doesn't transform a function call with an arrow function", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            function foo() {}

            export default defineConfig<GQLProduct>({
                type: "grid",
                columns: [
                    {
                        name: foo(() => true),
                    }
                ]
            });
        `);
        expect(config).toContain('type: "grid"');
        expect(config).toContain("name: foo(() => true)");
    });
});
