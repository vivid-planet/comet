import { ListBlock, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type TeaserBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import styled, { css } from "styled-components";

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

const ItemWrapper = styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.d100};

    ${({ theme }) => css`
        ${theme.breakpoints.md.mediaQuery} {
            grid-template-columns: repeat(4, 1fr);
        }
    `}
`;
