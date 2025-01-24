import { isWithPreviewPropsData, PropsWithData, usePreview, withPreview } from "@comet/cms-site";
import { AccordionBlockData } from "@src/blocks.generated";
import { AccordionItemBlock } from "@src/common/blocks/AccordionItemBlock";
import { PageLayout } from "@src/layout/PageLayout";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

type AccordionBlockProps = PropsWithData<AccordionBlockData>;

export const AccordionBlock = withPreview(
    ({ data }: AccordionBlockProps) => {
        const openByDefaultBlockKeys = useMemo(
            () => data.blocks.filter((block) => block.props.openByDefault).map((block) => block.key),
            [data.blocks],
        );

        const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
            // Create a Set containing the keys of blocks where openByDefault is set to true
            return new Set(openByDefaultBlockKeys);
        });

        const { showPreviewSkeletons, isSelected, isHovered } = usePreview();

        useEffect(() => {
            if (showPreviewSkeletons) {
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

                const expandedItemsInPreview = new Set<string>(openByDefaultBlockKeys);
                const focusedBlockKey = getFocusedBlockKey();

                if (focusedBlockKey) {
                    expandedItemsInPreview.add(focusedBlockKey);
                }

                setExpandedItems(expandedItemsInPreview);
            }
        }, [showPreviewSkeletons, data.blocks, isSelected, isHovered, openByDefaultBlockKeys]);

        const handleChange = (itemKey: string) => {
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
                        onChange={() => handleChange(block.key)}
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
