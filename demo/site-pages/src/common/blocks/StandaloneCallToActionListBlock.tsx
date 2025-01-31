import { type PropsWithData, withPreview } from "@comet/cms-site";
import { type StandaloneCallToActionListBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { type CSSProperties } from "react";
import styled from "styled-components";

import { CallToActionListBlock } from "./CallToActionListBlock";

type StandaloneCallToActionListBlockProps = PropsWithData<StandaloneCallToActionListBlockData>;

const alignmentMap: Record<StandaloneCallToActionListBlockData["alignment"], CSSProperties["justifyContent"]> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
};

export const StandaloneCallToActionListBlock = withPreview(
    ({ data: { callToActionList, alignment } }: StandaloneCallToActionListBlockProps) => {
        return (
            <Root $alignment={alignmentMap[alignment]}>
                <CallToActionListBlock data={callToActionList} />
            </Root>
        );
    },
    { label: "CallToActionList" },
);

export const PageContentStandaloneCallToActionListBlock = (props: StandaloneCallToActionListBlockProps) => (
    <PageLayout grid>
        <PageLayoutContent>
            <StandaloneCallToActionListBlock {...props} />
        </PageLayoutContent>
    </PageLayout>
);

const Root = styled.div<{ $alignment: CSSProperties["justifyContent"] }>`
    display: flex;
    justify-content: ${({ $alignment }) => $alignment};
`;

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;
