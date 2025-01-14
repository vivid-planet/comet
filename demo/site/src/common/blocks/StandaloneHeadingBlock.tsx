import { PropsWithData, WithPreviewComponent } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { StandaloneHeadingBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { CSSProperties } from "react";

import { HeadingBlock } from "./HeadingBlock";

type StandaloneHeadingBlockProps = PropsWithData<StandaloneHeadingBlockData>;

export const StandaloneHeadingBlock = ({ data }: StandaloneHeadingBlockProps) => {
    const { heading, textAlignment } = data;
    return (
        <WithPreviewComponent data={data} label="Heading">
            <Root $textAlign={textAlignment}>
                <HeadingBlock data={heading} />
            </Root>
        </WithPreviewComponent>
    );
};

export const PageContentStandaloneHeadingBlock = (props: StandaloneHeadingBlockProps) => (
    <PageLayout grid>
        <PageLayoutContent>
            <StandaloneHeadingBlock {...props} />
        </PageLayoutContent>
    </PageLayout>
);

const Root = styled.div<{ textAlign: CSSProperties["textAlign"] }>({
    textAlign: ({ textAlign }) => textAlign,
});

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;
