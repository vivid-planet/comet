import { ListBlock, PropsWithData, withPreview } from "@comet/cms-site";
import { TeaserBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import styled from "styled-components";

import { TeaserItemBlock } from "./TeaserItemBlock";

export const TeaserBlock = withPreview(
    ({ data }: PropsWithData<TeaserBlockData>) => (
        <PageLayout grid>
            <PageLayoutContent>
                <ItemWrapper>
                    <ListBlock data={data} block={(block) => <TeaserItemBlock data={block} />} />
                </ItemWrapper>
            </PageLayoutContent>
        </PageLayout>
    ),
    { label: "Teaser" },
);

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;

const ItemWrapper = styled.div``;
