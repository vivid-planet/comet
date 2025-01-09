"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { StandaloneCallToActionListBlockData } from "@src/blocks.generated";
import { CSSProperties } from "react";
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

const Root = styled.div<{ $alignment: CSSProperties["justifyContent"] }>`
    display: flex;
    justify-content: ${({ $alignment }) => $alignment};
`;
