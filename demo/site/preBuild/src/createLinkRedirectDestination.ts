import { ExternalLinkBlockData, InternalLinkBlockData, LinkBlockData, NewsLinkBlockData } from "../../src/blocks.generated";

export function createLinkRedirectDestination(content: LinkBlockData) {
    switch (content.block?.type) {
        case "internal":
            return (content.block.props as InternalLinkBlockData).targetPage?.path;

        case "external":
            return (content.block.props as ExternalLinkBlockData).targetUrl;

        case "news":
            return (content.block.props as NewsLinkBlockData).id ? `/news/${(content.block.props as NewsLinkBlockData).id}` : undefined;

        default:
            return undefined;
    }
}
