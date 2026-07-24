/**
 * Projects a future-ui component's props into the comparable representation by
 * resolving its `<ComponentName>Props` interface through the TypeScript type
 * checker (via ts-morph). The checker is required because a component's props
 * are assembled from union aliases and `Omit<…>` inheritance that Storybook's
 * default `react-docgen` cannot resolve; only the checker deterministically
 * yields a union's options, a prop's optionality, and its `@defaultValue`.
 *
 * A component's props extend its root element (`Omit<BaseButton.Props, …>`),
 * which contributes the whole React/DOM pass-through surface. Those props are
 * not drift against Figma, so they are collapsed into a single
 * `rootElementProps` marker rather than enumerated. The two lists below decide,
 * globally for every component, which props are meaningful enough to enumerate
 * and which of those are code-only (`CODE_SUPERSET`).
 */
import { Node, type Project, type Type } from "ts-morph";

import { getOrAddSourceFile } from "./tsMorphProject.js";

/**
 * The shared override-API props (per the future-ui README). They are part of
 * the component's own API but model nothing in Figma, so they are enumerated
 * and marked `CODE_SUPERSET`. Global — never extended per component.
 */
const OVERRIDE_API_PROP_NAMES = ["className", "slots", "slotProps", "ref", "render"];

/**
 * Props the component inherits from its root element yet Figma still models, so
 * they are enumerated despite coming from a third-party type. Global — never
 * extended per component; if a component seems to need another entry here, stop
 * and raise it rather than adding one.
 */
const ALWAYS_MODELED_PROP_NAMES = ["children"];

/** The kind of a prop, derived deterministically from its resolved TypeScript type. */
export type PropKind = "enum" | "boolean" | "node" | "string" | "other";

export interface ProjectedProp {
    codeProp: string;
    kind: PropKind;
    codeType: string;
    /** Present for `enum` props: the literal options, in declaration order. */
    options?: string[];
    optional: boolean;
    /** The `@defaultValue` from the prop's TSDoc, parsed to its literal type. */
    default?: string | number | boolean;
    /** Marks a code-only prop that models nothing in Figma; excluded from drift. */
    classification?: "CODE_SUPERSET";
}

export interface ProjectedProps {
    props: Record<string, ProjectedProp>;
    /** The heritage clause a component extends for its root element's props, or `undefined`. */
    rootElementProps?: string;
}

const REACT_NODE_TYPE_NAMES = ["ReactNode", "React.ReactNode"];

function stripUndefinedSuffix(typeText: string): string {
    return typeText.replace(/\s*\|\s*undefined$/, "");
}

function isReactNodeType(typeText: string): boolean {
    const core = stripUndefinedSuffix(typeText);
    return REACT_NODE_TYPE_NAMES.includes(core) || /^(React\.)?ReactElement(<.*>)?$/.test(core);
}

function declaredTypeText(declaration: Node): string | undefined {
    if (Node.isPropertySignature(declaration) || Node.isPropertyDeclaration(declaration)) {
        return declaration.getTypeNode()?.getText();
    }
    return undefined;
}

function classify(type: Type, declaration: Node): { kind: PropKind; codeType: string; options?: string[] } {
    const members = type.isUnion() ? type.getUnionTypes() : [type];
    const definedMembers = members.filter((member) => !member.isUndefined());
    const resolvedText = type.getText(declaration);
    const codeType = stripUndefinedSuffix(declaredTypeText(declaration) ?? resolvedText);

    if (definedMembers.length > 0 && definedMembers.every((member) => member.isBooleanLiteral())) {
        return { kind: "boolean", codeType };
    }
    if (definedMembers.length > 0 && definedMembers.every((member) => member.isStringLiteral())) {
        return { kind: "enum", codeType, options: definedMembers.map((member) => String(member.getLiteralValue())) };
    }
    if (isReactNodeType(resolvedText) || isReactNodeType(codeType)) {
        return { kind: "node", codeType };
    }
    if (definedMembers.length === 1 && definedMembers[0].isString()) {
        return { kind: "string", codeType };
    }
    return { kind: "other", codeType };
}

function parseDefaultLiteral(raw: string): string | number | boolean {
    let value = raw.trim();
    const backticked = value.match(/^`([\s\S]*)`$/);
    if (backticked) {
        value = backticked[1].trim();
    }
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }
    const quoted = value.match(/^"([\s\S]*)"$/) ?? value.match(/^'([\s\S]*)'$/);
    if (quoted) {
        return quoted[1];
    }
    if (/^-?\d+(\.\d+)?$/.test(value)) {
        return Number(value);
    }
    return value;
}

function extractDefaultValue(declaration: Node): string | number | boolean | undefined {
    if (!Node.isJSDocable(declaration)) {
        return undefined;
    }
    for (const jsDoc of declaration.getJsDocs()) {
        for (const tag of jsDoc.getTags()) {
            if (tag.getTagName() === "defaultValue") {
                const comment = tag.getCommentText();
                if (comment) {
                    return parseDefaultLiteral(comment);
                }
            }
        }
    }
    return undefined;
}

/**
 * Projects the props of a component's `<ComponentName>Props` interface. Throws
 * when the interface is absent, so a missing or misnamed props type is
 * surfaced rather than approximated.
 */
export function projectComponentProps({
    project,
    componentFilePath,
    propsInterfaceName,
}: {
    project: Project;
    componentFilePath: string;
    propsInterfaceName: string;
}): ProjectedProps {
    const source = getOrAddSourceFile(project, componentFilePath);
    const propsInterface = source.getInterface(propsInterfaceName);
    if (!propsInterface) {
        throw new Error(`Could not find interface \`${propsInterfaceName}\` in "${componentFilePath}"`);
    }

    const heritage = propsInterface.getExtends().map((clause) => clause.getText());
    const rootElementProps = heritage.length > 0 ? heritage.join(" & ") : undefined;

    const props: Record<string, ProjectedProp> = {};
    for (const symbol of propsInterface.getType().getProperties()) {
        const name = symbol.getName();
        const declarations = symbol.getDeclarations();
        const isProjectDeclared = declarations.some((declaration) => !declaration.getSourceFile().isInNodeModules());

        if (!isProjectDeclared && !ALWAYS_MODELED_PROP_NAMES.includes(name)) {
            continue;
        }

        const declaration = symbol.getValueDeclaration() ?? declarations[0];
        const { kind, codeType, options } = classify(symbol.getTypeAtLocation(declaration), declaration);
        const defaultValue = extractDefaultValue(declaration);

        props[name] = {
            codeProp: name,
            kind,
            codeType,
            ...(options ? { options } : {}),
            optional: symbol.isOptional(),
            ...(defaultValue !== undefined ? { default: defaultValue } : {}),
            ...(OVERRIDE_API_PROP_NAMES.includes(name) ? { classification: "CODE_SUPERSET" } : {}),
        };
    }

    return { props, rootElementProps };
}
