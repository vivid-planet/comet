import { Project } from "ts-morph";

import { configsFromSourceFile } from "../tsMorphHelper";

describe("AdminGenerator TsMorph Parse Config", () => {
    const project = new Project({
        tsConfigFilePath: "tsconfig.json",
        skipAddingFilesFromTsConfig: true,
    });
    function parseString(sourceFileText: string) {
        const tsSource = project.createSourceFile("test.tsx", sourceFileText, { overwrite: true });
        return configsFromSourceFile(tsSource);
    }
    it("parses a simple static json", () => {
        const configs = parseString(`
            import { future_GridConfig as GridConfig } from "@comet/cms-admin";
            import { GQLProduct } from "@src/graphql.generated";

            export const ProductsGrid: GridConfig<GQLProduct> = {
                type: "grid",
                gqlType: "Product",
            }
        `);
        expect(configs.ProductsGrid).toEqual({ type: "grid", gqlType: "Product" });
    });

    it("parses an arrow function", () => {
        const configs = parseString(`
            import { future_GridConfig as GridConfig } from "@comet/cms-admin";
            import { GQLProduct } from "@src/graphql.generated";

            export const ProductForm: FormConfig<GQLProduct> = {
                type: "form",
                fields: [{
                    name: "foo",
                    validate: () => true
                }]
            }
        `);
        expect(configs.ProductForm).toEqual({ type: "form", fields: [{ name: "foo", validate: { code: "() => true", imports: [] } }] });
    });

    it("parses an arrow function referencing an imported component", () => {
        const configs = parseString(`
            import { future_GridConfig as GridConfig } from "@comet/cms-admin";
            import { GQLProduct } from "@src/graphql.generated";

            import { ProductTitle } from "./ProductTitle";

            export const ProductsGrid: GridConfig<GQLProduct> = {
                type: "grid",
                columns: [
                    {
                        name: "title",
                        renderCell: () => <ProductTitle />,
                    }
                ]
            }
            export const ProductsGrid: GridConfig<GQLProduct> = {
                foo: () => <ProductTitle />,
            }
        `);
        expect(configs.ProductsGrid).toEqual({
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
        const configs = parseString(`
            import { future_GridConfig as GridConfig } from "@comet/cms-admin";
            import { GQLProduct } from "@src/graphql.generated";

            import { ProductTitle } from "./ProductTitle";

            export const ProductsGrid: GridConfig<GQLProduct> = {
                type: "grid",
                columns: [
                    {
                        name: "title",
                        renderCell: () => { return <ProductTitle /> },
                    }
                ]
            }
        `);
        expect(configs.ProductsGrid).toEqual({
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
        const configs = parseString(`
            import { future_GridConfig as GridConfig } from "@comet/cms-admin";
            import { GQLProduct } from "@src/graphql.generated";

            const abc = 123;

            export const ProductsGrid: GridConfig<GQLProduct> = {
                foo: abc
            }
        `);
        expect(configs.ProductsGrid).toEqual({
            foo: 123,
        });
    });

    it("parser throws error for function at unsupported location", () => {
        expect(() => {
            parseString(`
                import { future_GridConfig as GridConfig } from "@comet/cms-admin";
                import { GQLProduct } from "@src/graphql.generated";
        
                export const ProductsGrid: GridConfig<GQLProduct> = {
                    foo: () => true
                }
            `);
        }).toThrow();
    });

    it("parser throws error for import at unsupported location", () => {
        expect(() => {
            parseString(`
                import { future_GridConfig as GridConfig } from "@comet/cms-admin";
                import { GQLProduct } from "@src/graphql.generated";

                import { Foo } from "./Foo";
        
                export const ProductsGrid: GridConfig<GQLProduct> = {
                    foo: Foo
                }
            `);
        }).toThrow();
    });
});
