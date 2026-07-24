import { Node, type Project, type Symbol as TsMorphSymbol, type Type } from "ts-morph";

import type { PropDescription } from "./componentDescription.js";
import { FigmaCliError } from "./figmaCliError.js";
import { getOrAddSourceFile } from "./tsMorphProject.js";

/** The override API every component shares, which no Figma design describes. */
const OVERRIDE_API_PROP_NAMES = ["className", "slots", "slotProps", "ref"];

/** Inherited props a Figma design can specify, so the code side has to describe them. */
const DESCRIBED_INHERITED_PROP_NAMES = ["children"];

const REACT_NODE_TYPE_NAMES = ["ReactNode", "React.ReactNode"];

function isInheritedFromRootElement(prop: TsMorphSymbol): boolean {
    return prop.getDeclarations().every((declaration) => declaration.getSourceFile().isInNodeModules());
}

function isDescribedProp(prop: TsMorphSymbol): boolean {
    const name = prop.getName();
    if (OVERRIDE_API_PROP_NAMES.includes(name)) {
        return false;
    }
    return !isInheritedFromRootElement(prop) || DESCRIBED_INHERITED_PROP_NAMES.includes(name);
}

function describePropType(propType: Type, declaration: Node): Pick<PropDescription, "type" | "options"> {
    const members = propType.isUnion() ? propType.getUnionTypes() : [propType];
    const definedMembers = members.filter((member) => !member.isUndefined());

    if (definedMembers.every((member) => member.isBooleanLiteral())) {
        return { type: "boolean" };
    }
    if (definedMembers.every((member) => member.isStringLiteral())) {
        return { type: "enum", options: definedMembers.map((member) => String(member.getLiteralValue())) };
    }
    // `ReactNode` is a union of too many members to recognize by them; the checker prints its name even through an alias.
    if (REACT_NODE_TYPE_NAMES.includes(propType.getText(declaration))) {
        return { type: "node" };
    }
    if (definedMembers.length === 1 && definedMembers[0].isString()) {
        return { type: "string" };
    }
    return { type: "other" };
}

/** The value of a backticked `@defaultValue` tag; a tag that describes the default in prose documents no value. */
function parseDocumentedValue(tagText: string): string | boolean | undefined {
    const backticked = tagText.trim().match(/^`([^`]*)`$/);
    if (!backticked) {
        return undefined;
    }
    const value = backticked[1].trim();
    if (value === "true" || value === "false") {
        return value === "true";
    }
    const quoted = value.match(/^"([^"]*)"$/) ?? value.match(/^'([^']*)'$/);
    return quoted ? quoted[1] : value;
}

/** The documented default only; the default in the component's signature is deliberately not read. */
function extractDocumentedDefault(declaration: Node): string | boolean | undefined {
    if (!Node.isJSDocable(declaration)) {
        return undefined;
    }
    const tags = declaration.getJsDocs().flatMap((jsDoc) => jsDoc.getTags());
    const comment = tags.find((tag) => tag.getTagName() === "defaultValue")?.getCommentText();
    return comment ? parseDocumentedValue(comment) : undefined;
}

function describeProp(prop: TsMorphSymbol): PropDescription {
    const declaration = prop.getValueDeclaration() ?? prop.getDeclarations()[0];
    const { type, options } = describePropType(prop.getTypeAtLocation(declaration), declaration);
    const documentedDefault = type === "enum" || type === "boolean" ? extractDocumentedDefault(declaration) : undefined;

    return {
        type,
        ...(options ? { options } : {}),
        ...(documentedDefault !== undefined ? { default: documentedDefault } : {}),
    };
}

export function describeComponentProps({
    project,
    componentFilePath,
    propsInterfaceName,
}: {
    project: Project;
    componentFilePath: string;
    propsInterfaceName: string;
}): Record<string, PropDescription> {
    const propsInterface = getOrAddSourceFile(project, componentFilePath).getInterface(propsInterfaceName);
    if (!propsInterface) {
        throw new FigmaCliError("source_incomplete", `Could not find interface \`${propsInterfaceName}\` in "${componentFilePath}"`);
    }

    const describedProps = propsInterface
        .getType()
        .getProperties()
        .filter(isDescribedProp)
        .map((prop): [name: string, description: PropDescription] => [prop.getName(), describeProp(prop)])
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

    return Object.fromEntries(describedProps);
}
