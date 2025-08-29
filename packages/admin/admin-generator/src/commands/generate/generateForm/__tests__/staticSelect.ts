import { ESLint } from "eslint";
import { promises as fs } from "fs";
import { buildSchema, introspectionFromSchema } from "graphql";
import { type JsxAttribute, Project, SyntaxKind } from "ts-morph";

import { parseConfig } from "../../config/parseConfig";
import { type FormConfig } from "../../generate-command";
import { generateForm } from "../generateForm";

const project = new Project({
    tsConfigFilePath: "src/.test/tsconfig.json",
    skipAddingFilesFromTsConfig: true,
});

async function lintCode(contents: string, filePath: string) {
    const eslint = new ESLint({
        cwd: process.cwd(),
        fix: true,
    });

    await fs.writeFile(`src/.test/${filePath}`, contents);
    const lintResult = await eslint.lintText(contents, {
        filePath: `src/.test/${filePath}`,
    });
    if (lintResult[0].errorCount > 0 || lintResult[0].fatalErrorCount > 0) {
        const errorMessage = lintResult[0].messages
            .map((message) => {
                return message.message;
            })
            .join(".");

        throw new Error(`Linting error: \n${errorMessage}`);
    } else if (lintResult[0].output != null) {
        const tsSource = project.createSourceFile(`src/.test/${filePath}`, lintResult[0].output, { overwrite: true });
        return tsSource;
    } else {
        throw new Error("No output from linting");
    }
}

async function parseConfigString(sourceFileText: string) {
    const filePath = `${process.cwd()}/src/.test/test-${new Date().getTime()}.cometGen.tsx`;
    await fs.writeFile(filePath, sourceFileText);
    const ret = parseConfig(filePath);
    await fs.unlink(filePath);
    return ret;
}

describe("Form StaticSelect", () => {
    const schema = buildSchema(`
        enum ProductType {
            Cap
            Shirt
            Tie
        }
        type Query {
            product(id: ID!): Product!
            products: [Product!]!
        }
        type Mutation {
            createProduct(title: String!): Product!
        }
        type Product {
            id: ID!
            title: String!
            type: ProductType!
        }
    `);

    const gqlIntrospection = introspectionFromSchema(schema);

    it("creates RadioGroupField with values inferred from gql schema", async () => {
        const config = await parseConfigString(
            `
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            export default defineConfig<GQLProduct>({
                type: "form",
                gqlType: "Product",
                fields: [
                    {
                        type: "staticSelect",
                        name: "type",
                    },
                ],
            });
        `,
        );

        const generated = generateForm(
            { exportName: "ProductForm", gqlIntrospection, baseOutputFilename: "ProductForm", targetDirectory: "src" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config as FormConfig<any>,
        );

        const code = await lintCode(generated.code, "ProductForm.tsx");
        const fn = code.getFirstDescendantByKindOrThrow(SyntaxKind.FunctionDeclaration);
        expect(fn.getText()).toContain("<RadioGroupField");
        const radioField = code
            .getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
            .find((el) => el.getTagNameNode().getText() === "RadioGroupField");
        if (!radioField) throw new Error("RadioGroupField not found");
        const options = radioField.getAttributes().find((attr) => attr.asKind(SyntaxKind.JsxAttribute)?.getNameNode().getText() == "options");
        expect(options).toBeDefined();
        const optionsText = options?.getText();
        expect(optionsText).toContain(`value: "Cap"`);
        expect(optionsText).toContain(`label: <FormattedMessage id="product.type.cap" defaultMessage="Cap" />`);
    });

    it("creates RadioGroupField with values set in config", async () => {
        const config = await parseConfigString(
            `
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            export default defineConfig<GQLProduct>({
                type: "form",
                gqlType: "Product",
                fields: [
                    {
                        type: "staticSelect",
                        name: "type",
                        values: [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"],
                    },
                ],
            });
        `,
        );

        const generated = generateForm(
            { exportName: "ProductForm", gqlIntrospection, baseOutputFilename: "ProductForm", targetDirectory: "src" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config as FormConfig<any>,
        );

        const code = await lintCode(generated.code, "ProductForm.tsx");
        const fn = code.getFirstDescendantByKindOrThrow(SyntaxKind.FunctionDeclaration);
        expect(fn.getText()).toContain("<RadioGroupField");
        const radioField = code
            .getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
            .find((el) => el.getTagNameNode().getText() === "RadioGroupField");
        if (!radioField) throw new Error("RadioGroupField not found");
        const options = radioField.getAttributes().find((attr) => attr.asKind(SyntaxKind.JsxAttribute)?.getNameNode().getText() == "options");
        expect(options).toBeDefined();
        const optionsText = options?.getText();
        expect(optionsText).toContain(`value: "Cap"`);
        expect(optionsText).toContain(`label: <FormattedMessage id="product.type.cap" defaultMessage="great Cap" />`);
        expect(optionsText).toContain(`value: "Shirt"`);
        expect(optionsText).toContain(`label: <FormattedMessage id="product.type.shirt" defaultMessage="Shirt" />`);
    });

    it("creates SelectField with values set in config", async () => {
        const config = await parseConfigString(
            `
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";

            export default defineConfig<GQLProduct>({
                type: "form",
                gqlType: "Product",
                fields: [
                    {
                        type: "staticSelect",
                        name: "type",
                        inputType: "select",
                        values: [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"],
                    },
                ],
            });
        `,
        );

        const generated = generateForm(
            { exportName: "ProductForm", gqlIntrospection, baseOutputFilename: "ProductForm", targetDirectory: "src" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config as FormConfig<any>,
        );

        const code = await lintCode(generated.code, "ProductForm.tsx");
        const fn = code.getFirstDescendantByKindOrThrow(SyntaxKind.FunctionDeclaration);
        expect(fn.getText()).toContain("<FinalFormSelect");
        const selectField = code
            .getDescendantsOfKind(SyntaxKind.JsxElement)
            .find((el) => el.getOpeningElement().getTagNameNode().getText() === "FinalFormSelect");
        if (!selectField) throw new Error("FinalFormSelect not found");
        const menuItems = selectField.getChildrenOfKind(SyntaxKind.JsxElement);
        expect(menuItems.length).toBe(3);
        expect(menuItems[0].getText()).toContain(`<MenuItem value="Cap">`);
        expect(menuItems[0].getText()).toContain(`<FormattedMessage id="product.type.cap" defaultMessage="great Cap" />`);
        expect(menuItems[1].getText()).toContain(`<FormattedMessage id="product.type.shirt" defaultMessage="Shirt" />`);
    });

    it("creates SelectField with imported values", async () => {
        const config = await parseConfigString(
            `
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";
            import { typeValues } from "./typeValues";

            export default defineConfig<GQLProduct>({
                type: "form",
                gqlType: "Product",
                fields: [
                    {
                        type: "staticSelect",
                        name: "type",
                        inputType: "select",
                        values: typeValues,
                    },
                ],
            });
        `,
        );

        const generated = generateForm(
            { exportName: "ProductForm", gqlIntrospection, baseOutputFilename: "ProductForm", targetDirectory: "src" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config as FormConfig<any>,
        );

        const code = await lintCode(generated.code, "ProductForm.tsx");
        const fn = code.getFirstDescendantByKindOrThrow(SyntaxKind.FunctionDeclaration);
        expect(fn.getText()).toContain("<FinalFormSelect");
        const selectField = code
            .getDescendantsOfKind(SyntaxKind.JsxElement)
            .find((el) => el.getOpeningElement().getTagNameNode().getText() === "FinalFormSelect");
        if (!selectField) throw new Error("FinalFormSelect not found");
        const options = selectField
            .getOpeningElement()
            .getAttributes()
            .find((attr) => {
                return attr.getKind() == SyntaxKind.JsxAttribute && (attr as JsxAttribute).getNameNode().getText() == "options";
            });
        if (!options) throw new Error("options attribute not found");
        expect(options.getText()).toBe(`options={typeValues}`);
    });

    it("creates RadioGroupField with imported values", async () => {
        const config = await parseConfigString(
            `
            import { defineConfig } from "@comet/admin-generator";
            import { GQLProduct } from "@src/graphql.generated";
            import { typeValues } from "./typeValues";

            export default defineConfig<GQLProduct>({
                type: "form",
                gqlType: "Product",
                fields: [
                    {
                        type: "staticSelect",
                        name: "type",
                        inputType: "radio",
                        values: typeValues,
                    },
                ],
            });
        `,
        );

        const generated = generateForm(
            { exportName: "ProductForm", gqlIntrospection, baseOutputFilename: "ProductForm", targetDirectory: "src" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config as FormConfig<any>,
        );

        const code = await lintCode(generated.code, "ProductForm.tsx");
        const fn = code.getFirstDescendantByKindOrThrow(SyntaxKind.FunctionDeclaration);
        expect(fn.getText()).toContain("<RadioGroupField");
        const radioField = code
            .getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
            .find((el) => el.getTagNameNode().getText() === "RadioGroupField");
        if (!radioField) throw new Error("RadioGroupField not found");
        const options = radioField.getAttributes().find((attr) => attr.asKind(SyntaxKind.JsxAttribute)?.getNameNode().getText() == "options");
        expect(options).toBeDefined();
        expect(options?.getText()).toBe(`options={typeValues}`);
    });
});
