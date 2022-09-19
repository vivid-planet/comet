import { FieldPolicy, Reference } from "@apollo/client";

type KeyArgs = FieldPolicy<unknown>["keyArgs"];
export interface OffsetLimitPagination<T> {
    nodes: T[];
    [key: string]: unknown;
}

export function offsetLimitPagination<T = Reference>(keyArgs: KeyArgs = false): FieldPolicy<OffsetLimitPagination<T>> {
    return {
        keyArgs,
        merge(existing, incoming, { args }) {
            let merged = existing ? { ...existing, nodes: [...existing.nodes] } : { nodes: [] };
            if (args) {
                const { offset = 0 } = args;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { nodes, ...restProps } = incoming;
                if (nodes != null) {
                    for (let i = 0; i < incoming.nodes.length; ++i) {
                        merged.nodes[offset + i] = incoming.nodes[i];
                    }

                    merged = { ...restProps, nodes: [...merged.nodes] };
                }
            } else {
                merged = { ...existing, ...incoming, nodes: [...merged.nodes, ...incoming.nodes] };
            }
            return merged;
        },
    };
}
