import { ListBlock, PropsWithData, WithPreviewComponent } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { TeaserBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

import { TeaserItemBlock } from "./TeaserItemBlock";

export const TeaserBlock = ({ data }: PropsWithData<TeaserBlockData>) => (
    <WithPreviewComponent data={data} label="Teaser">
        <PageLayout grid>
            <PageLayoutContent>
                <ItemWrapper>
                    <ListBlock data={data} block={(block) => <TeaserItemBlock data={block} />} />
                </ItemWrapper>
            </PageLayoutContent>
        </PageLayout>
    </WithPreviewComponent>
);

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;

const ItemWrapper = styled("div")(({ theme }) => ({
    display: "grid",
    gap: theme.spacing.D100,
    [theme.breakpoints.sm.mediaQuery]: {
        gridTemplateColumns: "repeat(4, 1fr)",
    },
}));
