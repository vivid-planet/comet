/** The kinds of value a prop accepts; `other` covers a code type none of the others fit. */
export type PropType = "enum" | "boolean" | "string" | "node" | "other";

export interface PropDescription {
    type: PropType;
    /** An `enum` prop's values, camelCased. */
    options?: string[];
    /** Only an `enum` or `boolean` prop has one. */
    default?: string | boolean;
}

/** A component's API surface, described from the Figma design or from the code in one shape so the two can be compared. */
export interface ComponentDescription {
    component: string;
    nodeId: string;
    /** Keyed by code prop name, sorted. */
    props: Record<string, PropDescription>;
}
