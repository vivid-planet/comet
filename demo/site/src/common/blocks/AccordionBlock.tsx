import { isWithPreviewPropsData, PropsWithData, usePreview, withPreview } from "@comet/cms-site";
import { AccordionBlockData } from "@src/blocks.generated";
import { AccordionItemBlock } from "@src/common/blocks/AccordionItemBlock";
import { PageLayout } from "@src/layout/PageLayout";
import { useEffect, useState } from "react";
import styled from "styled-components";

type AccordionBlockProps = PropsWithData<AccordionBlockData>;

export const AccordionBlock = withPreview(
    ({ data }: AccordionBlockProps) => {
        const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
            // Create a Set containing the keys of blocks where openByDefault is set to true

            const defaultExpandedItems = data.blocks.filter((block) => block.props.openByDefault).map((block) => block.key);

            return new Set(defaultExpandedItems);
        });

        const { showPreviewSkeletons, isSelected, isHovered } = usePreview();

        useEffect(() => {
            if (showPreviewSkeletons) {
                const getOpenByDefaultBlockKeys = () => data.blocks.filter((block) => block.props.openByDefault).map((block) => block.key);

                const getFocusedBlockKey = () => {
                    const focusedBlock = data.blocks.find((block) => {
                        if (!isWithPreviewPropsData(block)) {
                            return false;
                        }

                        const url = block.adminMeta?.route;

                        return url && (isSelected(url, { exactMatch: false }) || isHovered(url, { exactMatch: false }));
                    });

                    return focusedBlock?.key;
                };

                setExpandedItems(() => {
                    const expandedItemsInPreview = new Set<string>(getOpenByDefaultBlockKeys());
                    const focusedBlockKey = getFocusedBlockKey();

                    if (focusedBlockKey) {
                        expandedItemsInPreview.add(focusedBlockKey);
                    }

                    return expandedItemsInPreview;
                });
            }
        }, [showPreviewSkeletons, data.blocks, isSelected, isHovered]);

        const handleItemClick = (itemKey: string) => {
            const newExpandedItems = new Set(expandedItems);

            newExpandedItems.has(itemKey) ? newExpandedItems.delete(itemKey) : newExpandedItems.add(itemKey);

            setExpandedItems(newExpandedItems);
        };

        return (
            <Root>
                {data.blocks.map((block) => (
                    <AccordionItemBlock
                        key={block.key}
                        data={block.props}
                        onItemClick={() => handleItemClick(block.key)}
                        isExpanded={expandedItems.has(block.key)}
                    />
                ))}
            </Root>
        );
    },
    { label: "Accordion" },
);

export const PageContentAccordionBlock = (props: AccordionBlockProps) => (
    <PageLayout grid>
        <PageLayoutContent>
            <AccordionBlock {...props} />
        </PageLayoutContent>
    </PageLayout>
);

const Root = styled.div`
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid ${({ theme }) => theme.palette.gray["300"]};
`;

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;
