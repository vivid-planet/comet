import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type TeaserItemBlockData } from "@src/blocks.generated";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { defaultRichTextInlineStyleMap, RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { Typography } from "@src/common/components/Typography";
import { SvgUse } from "@src/common/helpers/SvgUse";
import { type Renderers } from "redraft";
import styled from "styled-components";

const descriptionRenderers: Renderers = {
    inline: defaultRichTextInlineStyleMap,
};

export const TeaserItemBlock = withPreview(
    ({ data: { media, title, description, link } }: PropsWithData<TeaserItemBlockData>) => (
        <Link data={link.link}>
            <MediaMobile>
                <MediaBlock data={media} aspectRatio="1x1" sizes="20vw" />
            </MediaMobile>
            <MediaDesktop>
                <MediaBlock data={media} aspectRatio="16x9" sizes="20vw" />
            </MediaDesktop>
            <ContentContainer>
                <TitleTypography variant="h350">{title}</TitleTypography>
                <Typography variant="p200">
                    <RichTextBlock data={description} renderers={descriptionRenderers} />
                </Typography>
                <TextLinkContainer>
                    <SvgUse href="/assets/icons/arrow-right.svg#root" width={16} height={16} />
                    <LinkText>{link.text}</LinkText>
                </TextLinkContainer>
            </ContentContainer>
        </Link>
    ),
    { label: "Teaser Item" },
);

const Link = styled(LinkBlock)`
    text-decoration: none;
    cursor: pointer;
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.S300};
    color: ${({ theme }) => theme.palette.text.primary};

    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        flex: unset;
        gap: ${({ theme }) => theme.spacing.S400};
        flex-direction: column;
    }
`;

const MediaMobile = styled.div`
    flex: 1;

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        display: none;
    }
`;

const MediaDesktop = styled.div`
    flex: 1;
    display: none;

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        display: block;
    }
`;

const ContentContainer = styled.div`
    flex: 2;
`;

const TitleTypography = styled(Typography)`
    margin-bottom: ${({ theme }) => theme.spacing.S100};
`;

const TextLinkContainer = styled.div`
    margin-top: ${({ theme }) => theme.spacing.S300};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.S200};
    color: ${({ theme }) => theme.palette.primary.main};
    transition: color 0.3s ease-in-out;

    &:hover {
        color: ${({ theme }) => theme.palette.primary.dark};
    }
`;

const LinkText = styled.span`
    font-family: ${({ theme }) => theme.fontFamily};
    font-size: 16px;
    font-weight: 700;
`;
