import { hasRichTextBlockContent, PropsWithData, SvgImageBlock, withPreview } from "@comet/site-nextjs";
import { KeyFactsItemBlockData } from "@src/blocks.generated";
import { defaultRichTextInlineStyleMap, RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { Typography } from "@src/common/components/Typography";
import { Renderers } from "redraft";
import styled from "styled-components";

const descriptionRenderers: Renderers = {
    inline: defaultRichTextInlineStyleMap,
};

export const KeyFactItemBlock = withPreview(
    ({ data: { icon, fact, label, description } }: PropsWithData<KeyFactsItemBlockData>) => (
        <Root>
            {icon.damFile && <Icon data={icon} width={48} height={48} />}
            <FactTypography variant="h500">{fact}</FactTypography>
            <Typography variant="h350">{label}</Typography>
            {hasRichTextBlockContent(description) && (
                <DescriptionTypography variant="p200">
                    <RichTextBlock data={description} renderers={descriptionRenderers} />
                </DescriptionTypography>
            )}
        </Root>
    ),
    { label: "Key fact" },
);

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const Icon = styled(SvgImageBlock)`
    margin-bottom: ${({ theme }) => theme.spacing.S100};
`;

const FactTypography = styled(Typography)`
    margin-bottom: ${({ theme }) => theme.spacing.S300};
    color: ${({ theme }) => theme.palette.primary.dark};
`;

const DescriptionTypography = styled(Typography)`
    margin-top: ${({ theme }) => theme.spacing.S100};
`;
