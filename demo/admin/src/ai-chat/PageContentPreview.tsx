import { gql, useQuery } from "@apollo/client";
import { BlockPreview, IFrameBridgeProvider, useBlockContext, useBlockPreview, useContentScope, useSiteConfig } from "@comet/cms-admin";
import { Box } from "@mui/material";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import { useEffect, useRef, useState } from "react";

import { type GQLPageContentPreviewQuery, type GQLPageContentPreviewQueryVariables } from "./PageContentPreview.generated";

const pageContentPreviewQuery = gql`
    query PageContentPreview($id: ID!) {
        page(id: $id) {
            id
            content
        }
    }
`;

export function PageContentPreview({ pageId, newData }: { pageId: string; newData: unknown }) {
    const blockContext = useBlockContext();
    const blockContextRef = useRef(blockContext);
    blockContextRef.current = blockContext;
    const { scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });
    const previewApi = useBlockPreview();
    const [previewState, setPreviewState] = useState<unknown>(undefined);

    const { data } = useQuery<GQLPageContentPreviewQuery, GQLPageContentPreviewQueryVariables>(pageContentPreviewQuery, {
        variables: { id: pageId },
    });

    const currentData = data?.page;

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!newData || !(newData as any).content || !currentData) return;
        async function compute() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentState = await PageContentBlock.output2State((currentData as any).content, blockContextRef.current);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newState = PageContentBlock.input2State((newData as any).content);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentKeys = new Set((currentState as any).blocks.map((b: any) => b.key));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newKeys = new Set((newState as any).blocks.map((b: any) => b.key));
            const combinedBlocks = [
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(newState as any).blocks.map((b: any) => ({
                    ...b,
                    ...(currentKeys.has(b.key) ? {} : { previewType: "added" as const }),
                })),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(currentState as any).blocks.filter((b: any) => !newKeys.has(b.key)).map((b: any) => ({ ...b, previewType: "removed" as const })),
            ];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const combinedState = { ...(newState as any), blocks: combinedBlocks };

            const ps = PageContentBlock.createPreviewState(combinedState, {
                ...blockContextRef.current,
                parentUrl: "/",
                showVisibleOnly: false,
            });
            setPreviewState(ps);
        }
        void compute();
    }, [currentData, newData]);

    const previewUrl = `${siteConfig.blockPreviewBaseUrl}/page`;
    return (
        <IFrameBridgeProvider key={previewUrl}>
            <Box sx={{ height: 400 }}>
                <BlockPreview url={previewUrl} previewState={previewState} previewApi={previewApi} />
            </Box>
        </IFrameBridgeProvider>
    );
}
