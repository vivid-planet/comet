<<<<<<< HEAD
import { ListBlock, type PropsWithData, withPreview } from "@comet/cms-site";
import { type KeyFactsBlockData } from "@src/blocks.generated";
=======
import { ListBlock, PropsWithData, withPreview } from "@comet/site-nextjs";
import { KeyFactsBlockData } from "@src/blocks.generated";
>>>>>>> main
import { PageLayout } from "@src/layout/PageLayout";
import styled, { css } from "styled-components";

import { KeyFactItemBlock } from "./KeyFactItemBlock";

export const KeyFactsBlock = withPreview(
    ({ data }: PropsWithData<KeyFactsBlockData>) => (
        <PageLayout grid>
            <PageLayoutContent>
                <ItemWrapper $listItemCount={data.blocks.length}>
                    <ListBlock data={data} block={(block) => <KeyFactItemBlock data={block} />} />
                </ItemWrapper>
            </PageLayoutContent>
        </PageLayout>
    ),
    { label: "Key facts" },
);

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;

const ItemWrapper = styled.div<{ $listItemCount: number }>`
    display: grid;
    gap: ${({ theme }) => theme.spacing.D100};

    ${({ $listItemCount, theme }) =>
        $listItemCount > 0 &&
        css`
            grid-template-columns: repeat(${Math.min($listItemCount, 2)}, 1fr);

            ${theme.breakpoints.md.mediaQuery} {
                grid-template-columns: repeat(${Math.min($listItemCount, 4)}, 1fr);
            }
        `}
`;
