import { ListBlock, PropsWithData, WithPreviewComponent } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { AccordionBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

import { AccordionItemBlock } from "./AccordionItemBlock";

type AccordionBlockProps = PropsWithData<AccordionBlockData>;

const AccordionBlock = ({ data }: AccordionBlockProps) => (
    <WithPreviewComponent data={data} label="Accordion">
        <Root>
            <ListBlock data={data} block={(block) => <AccordionItemBlock data={block} />} />
        </Root>
    </WithPreviewComponent>
);

export const PageContentAccordionBlock = (props: AccordionBlockProps) => {
    return (
        <PageLayout grid>
            <PageLayoutContent>
                <AccordionBlock {...props} />
            </PageLayoutContent>
        </PageLayout>
    );
};

const Root = styled.div`
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${({ theme }) => theme.palette.gray["300"]};
`;

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;
