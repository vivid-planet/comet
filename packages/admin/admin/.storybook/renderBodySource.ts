import { parseExpression } from "@babel/parser";
import { type Options } from "prettier";
import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";
import { format } from "prettier/standalone";

// Mirrors the repo-root .prettierrc.json. The standalone Prettier build used in
// the browser preview cannot read config files, so these values are kept in sync by hand.
const prettierOptions: Options = {
    parser: "babel-ts",
    plugins: [babelPlugin, estreePlugin],
    printWidth: 150,
    tabWidth: 4,
    trailingComma: "all",
    semi: true,
};

interface RenderBodySourceContext {
    parameters?: {
        docs?: {
            source?: {
                originalSource?: string;
            };
        };
    };
}

function dedent(text: string): string {
    const lines = text.split("\n");
    const indentWidths = lines.filter((line) => line.trim().length > 0).map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);
    const commonIndent = indentWidths.length > 0 ? Math.min(...indentWidths) : 0;
    return lines.map((line) => line.slice(commonIndent)).join("\n");
}

async function formatRenderBody(inner: string, isExpressionBody: boolean): Promise<string> {
    if (isExpressionBody) {
        const formatted = await format(inner, prettierOptions);
        return formatted.replace(/;\s*$/, "").trimEnd();
    }

    // A block body cannot be formatted on its own — its top-level `return` is a
    // syntax error at program scope — so format it inside an arrow wrapper and strip that wrapper back off.
    const formatted = await format(`() => {${inner}}`, prettierOptions);
    const withoutWrapper = formatted.replace(/^\(\)\s*=>\s*\{\r?\n?/, "").replace(/\r?\n?\};?\s*$/, "");
    return dedent(withoutWrapper).trimEnd();
}

function extractRenderBody(storySource: string): string | Promise<string> | undefined {
    let ast: ReturnType<typeof parseExpression>;
    try {
        ast = parseExpression(storySource, { plugins: ["typescript", "jsx"] });
    } catch {
        return undefined;
    }

    if (ast.type !== "ObjectExpression") {
        return undefined;
    }

    for (const property of ast.properties) {
        if (property.type !== "ObjectProperty" && property.type !== "ObjectMethod") {
            continue;
        }

        const { key } = property;
        const isRenderKey = (key.type === "Identifier" && key.name === "render") || (key.type === "StringLiteral" && key.value === "render");
        if (!isRenderKey) {
            continue;
        }

        const fn = property.type === "ObjectMethod" ? property : property.value;
        if (fn.type !== "ObjectMethod" && fn.type !== "ArrowFunctionExpression" && fn.type !== "FunctionExpression") {
            return undefined;
        }

        const { body } = fn;
        if (typeof body.start !== "number" || typeof body.end !== "number") {
            return undefined;
        }

        const isBlockBody = body.type === "BlockStatement";
        const inner = isBlockBody ? storySource.slice(body.start + 1, body.end - 1) : storySource.slice(body.start, body.end);
        const fallback = dedent(inner).trim();

        return formatRenderBody(inner, !isBlockBody).catch(() => fallback);
    }

    return undefined;
}

/**
 * Storybook Code-panel source transform that, for stories with a custom `render`
 * function, shows the authored render body instead of the whole story-object literal.
 *
 * The Code panel only runs a source transform on the serialized snippet the renderer
 * emits, which requires `docs.source.type: "dynamic"`. That snippet drops hooks and
 * comments and renders `forwardRef` components as `<React.ForwardRef>`, so it is ignored:
 * the render body is extracted from the authored `originalSource` on the story context
 * instead. Stories without a custom `render` keep the dynamic snippet unchanged.
 */
export function renderBodySourceTransform(code: string, storyContext?: RenderBodySourceContext): string | Promise<string> {
    const originalSource = storyContext?.parameters?.docs?.source?.originalSource;
    if (typeof originalSource !== "string") {
        return code;
    }

    return extractRenderBody(originalSource) ?? code;
}
