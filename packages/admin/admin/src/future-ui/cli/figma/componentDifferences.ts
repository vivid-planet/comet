import type { ComponentDescription, PropDescription, PropType } from "./componentDescription.js";
import type { ImplementedComponent } from "./describeImplementedComponent.js";

type PropDefault = NonNullable<PropDescription["default"]>;
type Props = ComponentDescription["props"];

type ComponentDifference =
    | { kind: "PROP_ONLY_IN_FIGMA"; prop: string; figma: PropDescription }
    | { kind: "PROP_ONLY_IN_CODE"; prop: string; code: PropDescription }
    | { kind: "CHANGED_TYPE"; prop: string; figmaType: PropType; codeType: PropType }
    | { kind: "CHANGED_OPTIONS"; prop: string; onlyInFigma: string[]; onlyInCode: string[] }
    | { kind: "CHANGED_DEFAULT"; prop: string; figmaDefault: PropDefault; codeDefault?: PropDefault }
    | { kind: "LINKED_NODE_NOT_IN_FIGMA"; nodeId: string }
    | { kind: "UNLINKED_COMPONENT"; figmaName: string; nodeId: string };

function toComparableName(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function isSameComponentName(figmaName: string, codeName: string): boolean {
    return toComparableName(figmaName) === toComparableName(codeName);
}

function isAcceptedType(implementedType: PropType, targetType: PropType): boolean {
    const isNodeForString = targetType === "string" && implementedType === "node";
    return implementedType === targetType || isNodeForString;
}

interface PropComparison {
    prop: string;
    target: PropDescription;
    implemented: PropDescription;
}

function compareOptions({ prop, target, implemented }: PropComparison): ComponentDifference[] {
    const targetOptions = target.options ?? [];
    const implementedOptions = implemented.options ?? [];
    const onlyInFigma = targetOptions.filter((option) => !implementedOptions.includes(option));
    const onlyInCode = implementedOptions.filter((option) => !targetOptions.includes(option));
    if (onlyInFigma.length === 0 && onlyInCode.length === 0) {
        return [];
    }
    return [{ kind: "CHANGED_OPTIONS", prop, onlyInFigma, onlyInCode }];
}

function compareDefault({ prop, target, implemented }: PropComparison): ComponentDifference[] {
    if (target.default === undefined || implemented.default === target.default) {
        return [];
    }
    return [{ kind: "CHANGED_DEFAULT", prop, figmaDefault: target.default, codeDefault: implemented.default }];
}

function compareProp({ prop, target, implemented }: PropComparison): ComponentDifference[] {
    if (!isAcceptedType(implemented.type, target.type)) {
        return [{ kind: "CHANGED_TYPE", prop, figmaType: target.type, codeType: implemented.type }];
    }
    return [...compareOptions({ prop, target, implemented }), ...compareDefault({ prop, target, implemented })];
}

function listPropNames(targetProps: Props, implementedProps: Props): string[] {
    return [...new Set([...Object.keys(targetProps), ...Object.keys(implementedProps)])].sort();
}

export function compareProps(targetProps: Props, implementedProps: Props): ComponentDifference[] {
    return listPropNames(targetProps, implementedProps).flatMap((prop): ComponentDifference[] => {
        const targetProp = targetProps[prop];
        const implementedProp = implementedProps[prop];
        if (implementedProp === undefined) {
            return [{ kind: "PROP_ONLY_IN_FIGMA", prop, figma: targetProp }];
        }
        if (targetProp === undefined) {
            return [{ kind: "PROP_ONLY_IN_CODE", prop, code: implementedProp }];
        }
        return compareProp({ prop, target: targetProp, implemented: implementedProp });
    });
}

interface FigmaComponent {
    name: string;
    nodeId: string;
}

interface FigmaDesigns {
    inventory: FigmaComponent[];
    targetsByNodeId: ReadonlyMap<string, ComponentDescription>;
}

function findFigmaComponentWithSameName(implemented: ImplementedComponent, inventory: FigmaComponent[]): FigmaComponent | undefined {
    return inventory.find((figmaComponent) => isSameComponentName(figmaComponent.name, implemented.component));
}

function findUnlinkedComponentDifferences(implemented: ImplementedComponent, inventory: FigmaComponent[]): ComponentDifference[] {
    const figmaComponent = findFigmaComponentWithSameName(implemented, inventory);
    if (figmaComponent === undefined) {
        return [];
    }
    return [{ kind: "UNLINKED_COMPONENT", figmaName: figmaComponent.name, nodeId: figmaComponent.nodeId }];
}

export function findImplementedComponentDifferences({
    implemented,
    inventory,
    targetsByNodeId,
}: { implemented: ImplementedComponent } & FigmaDesigns): ComponentDifference[] {
    if (implemented.nodeId === undefined) {
        return findUnlinkedComponentDifferences(implemented, inventory);
    }
    const target = targetsByNodeId.get(implemented.nodeId);
    if (target === undefined) {
        return [{ kind: "LINKED_NODE_NOT_IN_FIGMA", nodeId: implemented.nodeId }];
    }
    return compareProps(target.props, implemented.props);
}
