import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type FooterContentBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { Typography } from "@src/common/components/Typography";
import { PageLayout } from "@src/layout/PageLayout";
import { createImageSizes } from "@src/util/createImageSizes";
import styled from "styled-components";

export const FooterContentBlock = withPreview(
    ({ data: { text, image, linkList, copyrightNotice } }: PropsWithData<FooterContentBlockData>) => {
        return (
            <Root>
                <PageLayout grid>
                    <PageLayoutContent>
                        <MobileTopContainer>
                            <ImageWrapper>
                                <DamImageBlock
                                    data={image}
                                    aspectRatio="1x1"
                                    style={{ objectFit: "contain" }}
                                    sizes={createImageSizes({ default: "20vw" })}
                                />
                            </ImageWrapper>
                            <RichTextWrapper>
                                <RichTextBlock data={text} disableLastBottomSpacing />
                            </RichTextWrapper>
                        </MobileTopContainer>
                        <DesktopTopContainer>
                            <RichTextWrapper>
                                <RichTextBlock data={text} disableLastBottomSpacing />
                            </RichTextWrapper>
                            <ImageWrapper>
                                <DamImageBlock
                                    data={image}
                                    aspectRatio="1x1"
                                    style={{ objectFit: "contain" }}
                                    sizes={createImageSizes({ default: "10vw" })}
                                />
                            </ImageWrapper>
                        </DesktopTopContainer>
                        <HorizontalLine />
                        <LinkCopyrightWrapper>
                            <nav>
                                {linkList.blocks.length > 0 && (
                                    <LinksWrapper>
                                        {linkList.blocks.map((block) => (
                                            <li key={block.key}>
                                                <LinkText as={LinkBlock} data={block.props.link} variant="p200">
                                                    {block.props.text}
                                                </LinkText>
                                            </li>
                                        ))}
                                    </LinksWrapper>
                                )}
                            </nav>
                            {copyrightNotice && <CopyrightNotice variant="p200">{copyrightNotice}</CopyrightNotice>}
                        </LinkCopyrightWrapper>
                    </PageLayoutContent>
                </PageLayout>
            </Root>
        );
    },
    { label: "Footer" },
);

const Root = styled.footer`
    margin-top: auto;
    background-color: ${({ theme }) => theme.palette.gray["900"]};
    color: ${({ theme }) => theme.palette.gray["50"]};
`;

const PageLayoutContent = styled.div`
    grid-column: 2 / -2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${({ theme }) => `${theme.spacing.D400} 0`};

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        position: relative;
        gap: ${({ theme }) => theme.spacing.D100};
        flex-direction: row;
        justify-content: space-between;
    }
`;

const MobileTopContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.D100};

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        display: none;
    }
`;

const DesktopTopContainer = styled.div`
    display: none;

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        display: flex;
        align-self: stretch;
        justify-content: space-between;
    }

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        flex-direction: row;
    }
`;

const RichTextWrapper = styled.div`
    width: 100%;
    text-align: center;

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        text-align: left;
    }

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        max-width: 80%;
    }
`;

const ImageWrapper = styled.div`
    width: 100px;

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        position: absolute;
        width: 100%;
        max-width: 100px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;

const LinkCopyrightWrapper = styled.div`
    color: ${({ theme }) => theme.palette.gray["400"]};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.S500};

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        width: 80%;
        align-items: flex-end;
    }
`;

const LinksWrapper = styled.ul`
    display: flex;
    gap: ${({ theme }) => theme.spacing.S500};
    flex-wrap: wrap;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
`;

const CopyrightNotice = styled(Typography)`
    text-align: center;

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        text-align: right;
    }
`;

const LinkText = styled(Typography)`
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: underline;
`;

const HorizontalLine = styled.hr`
    width: 100%;
    height: 1px;
    border: none;
    background-color: ${({ theme }) => theme.palette.gray["600"]};
    color: ${({ theme }) => theme.palette.gray["600"]};
    margin: ${({ theme }) => `${theme.spacing.D300} 0`};

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        display: none;
    }
`;
