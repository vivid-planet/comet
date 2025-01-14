import { PropsWithData, WithPreviewComponent } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { StandaloneCallToActionListBlockData } from "@src/blocks.generated";
import { createShouldForwardPropBlockList } from "@src/util/createShouldForwardPropBlockList";
import { CSSProperties } from "react";

import { CallToActionListBlock } from "./CallToActionListBlock";

type StandaloneCallToActionListBlockProps = PropsWithData<StandaloneCallToActionListBlockData>;

const alignmentMap: Record<StandaloneCallToActionListBlockData["alignment"], CSSProperties["justifyContent"]> = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
};

export const StandaloneCallToActionListBlock = ({ data }: StandaloneCallToActionListBlockProps) => {
    const { callToActionList, alignment } = data;
    return (
        <WithPreviewComponent data={data} label="CallToActionList">
            <Root alignment={alignmentMap[alignment]}>
                <CallToActionListBlock data={callToActionList} />
            </Root>
        </WithPreviewComponent>
    );
};

type RootStyleProps = {
    alignment: CSSProperties["justifyContent"];
};
const Root = styled("div", {
    shouldForwardProp: createShouldForwardPropBlockList(["alignment"]),
})<RootStyleProps>({
    display: "flex",
    justifyContent: ({ alignment }) => alignment,
});
