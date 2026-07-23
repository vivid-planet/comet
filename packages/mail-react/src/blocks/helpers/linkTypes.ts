import { hasProperty } from "./typeGuards.js";

export interface LinkBlock {
    type: string;
    props: unknown;
}

/**
 * Resolves the href of one link block type from the link block's props.
 *
 * Return `undefined` to render the linked text without a link.
 */
export type LinkHrefResolver<TProps = unknown> = (props: TProps) => string | undefined;

export function resolveExternalLinkHref(props: unknown): string | undefined {
    if (!hasProperty(props, "targetUrl")) {
        return undefined;
    }

    const { targetUrl } = props;

    return typeof targetUrl === "string" ? targetUrl : undefined;
}

export const builtInLinkTypes: Record<string, LinkHrefResolver> = {
    external: resolveExternalLinkHref,
};

export function getLinkBlock(entityData: unknown): LinkBlock | undefined {
    if (!hasProperty(entityData, "block")) {
        return undefined;
    }

    const { block } = entityData;

    if (!hasProperty(block, "type") || !hasProperty(block, "props")) {
        return undefined;
    }

    const { type, props } = block;

    return typeof type === "string" ? { type, props } : undefined;
}

/**
 * Merges the application's link-type resolvers over the built-in `external` type.
 *
 * Consumers declare each resolver's props via the typed map, but at runtime they
 * are unknown link data. This one contained cast lets consumers work typed
 * without casting in their own resolvers.
 */
export function mergeLinkTypes<TLinkTypes extends Record<string, unknown>>(
    consumerLinkTypes: { [TLinkType in keyof TLinkTypes]: LinkHrefResolver<TLinkTypes[TLinkType]> } | undefined,
): Record<string, LinkHrefResolver> {
    return {
        ...builtInLinkTypes,
        ...(consumerLinkTypes as Record<string, LinkHrefResolver> | undefined),
    };
}
