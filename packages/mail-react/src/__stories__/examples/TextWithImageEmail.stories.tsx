import { MjmlColumn, MjmlImage, MjmlSpacer } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MjmlMailRoot } from "../../components/mailRoot/MjmlMailRoot.js";
import { MjmlSection } from "../../components/section/MjmlSection.js";
import { MjmlText } from "../../components/text/MjmlText.js";
import { registerStyles } from "../../styles/registerStyles.js";
import { createTheme } from "../../theme/createTheme.js";
import { getDefaultFromResponsiveValue } from "../../theme/responsiveValue.js";
import { css } from "../../utils/css.js";

const config: Meta = {
    title: "Examples/TextWithImageEmail",
    parameters: { mailRoot: false },
};

export default config;

type Story = StoryObj;

export const Default: Story = {
    render: () => {
        const theme = createTheme({
            text: {
                defaultVariant: "body",
                variants: {
                    heading: { fontSize: "22px", lineHeight: "28px", fontWeight: "bold" },
                    body: { fontSize: "16px", lineHeight: "24px" },
                },
            },
        });

        const IMAGE_WIDTH = 120;
        const IMAGE_TEXT_GAP = 20;

        registerStyles(
            (theme) => css`
                ${theme.breakpoints.default.belowMediaQuery} {
                    .textWithImageEmail__textColumn {
                        width: calc(100% - ${IMAGE_WIDTH}px) !important;
                        max-width: calc(100% - ${IMAGE_WIDTH}px) !important;
                    }
                }

                ${theme.breakpoints.mobile.belowMediaQuery} {
                    .textWithImageEmail__imageColumn {
                        margin-bottom: 10px;
                    }

                    .textWithImageEmail__textColumn {
                        width: 100% !important;
                        max-width: 100% !important;
                    }

                    .textWithImageEmail__textColumn > table > tbody > tr > td {
                        padding-left: 0 !important;
                    }
                }
            `,
        );

        const sectionIndent = getDefaultFromResponsiveValue(theme.sizes.contentIndentation);
        const sectionInnerWidth = theme.sizes.bodyWidth - 2 * sectionIndent;
        const textColumnWidth = sectionInnerWidth - IMAGE_WIDTH;

        return (
            <MjmlMailRoot theme={theme}>
                <MjmlSection backgroundColor="#1a1a1a" indent>
                    <MjmlColumn>
                        <MjmlSpacer height={15} />
                        <MjmlText color="#ffffff" fontWeight="bold" align="center">
                            Company Name
                        </MjmlText>
                        <MjmlSpacer height={15} />
                    </MjmlColumn>
                </MjmlSection>

                <MjmlSection indent>
                    <MjmlColumn>
                        <MjmlSpacer height={30} />
                    </MjmlColumn>
                </MjmlSection>

                <MjmlSection indent>
                    <MjmlColumn className="textWithImageEmail__imageColumn" width={`${IMAGE_WIDTH}px`} verticalAlign="middle">
                        <MjmlImage src={`https://picsum.photos/seed/1/${IMAGE_WIDTH}/150`} alt="Featured image" align="center" width={IMAGE_WIDTH} />
                    </MjmlColumn>
                    <MjmlColumn
                        className="textWithImageEmail__textColumn"
                        width={`${textColumnWidth}px`}
                        paddingLeft={`${IMAGE_TEXT_GAP}px`}
                        verticalAlign="middle"
                    >
                        <MjmlText variant="heading" bottomSpacing>
                            Responsive Text-Image
                        </MjmlText>
                        <MjmlText>
                            Demonstrates a responsive text-image layout with a fixed-width image column and a text column taking up remaining space.
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>

                <MjmlSection indent>
                    <MjmlColumn>
                        <MjmlSpacer height={30} />
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>
        );
    },
};
