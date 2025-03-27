import { Project } from "ts-morph";

import { configFromSourceFile } from "../tsMorphHelper";

describe("AdminGenerator TsMorph Parse Config", () => {
    const project = new Project({
        tsConfigFilePath: "tsconfig.json",
        skipAddingFilesFromTsConfig: true,
    });
    function parseString(sourceFileText: string) {
        const tsSource = project.createSourceFile("test.tsx", sourceFileText, { overwrite: true });
        return configFromSourceFile(tsSource);
    }
    it("parses a simple static json", () => {
        const config = parseString(`
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            export default defineConfig<GQLProduct>({
                type: "grid",
                gqlType: "Product",
            });
        `);
        expect(config).toEqual({ type: "grid", gqlType: "Product" });
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
        expect(config).toEqual({ type: "form", fields: [{ name: "foo", validate: { code: "() => true", imports: [] } }] });
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
        expect(config).toEqual({
            type: "grid",
            columns: [
                {
                    name: "title",
                    renderCell: { code: "() => <ProductTitle />", imports: [{ name: "ProductTitle", import: "./ProductTitle" }] },
                },
            ],
        });
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
        expect(config).toEqual({
            type: "grid",
            columns: [
                {
                    name: "title",
                    renderCell: { code: "() => { return <ProductTitle /> }", imports: [{ name: "ProductTitle", import: "./ProductTitle" }] },
                },
            ],
        });
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
        expect(config).toEqual({
            foo: 123,
        });
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
});
