import { MjmlColumn, MjmlRaw } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { defaultTheme } from "../../../theme/defaultTheme.js";
import { getDefaultFromResponsiveValue } from "../../../theme/responsiveValue.js";
import { MjmlSection } from "../../section/MjmlSection.js";
import { HtmlImage } from "../HtmlImage.js";

type Story = StoryObj<typeof HtmlImage>;

const sectionIndent = getDefaultFromResponsiveValue(defaultTheme.sizes.contentIndentation);
const sectionInnerWidth = defaultTheme.sizes.bodyWidth - 2 * sectionIndent;

const config: Meta<typeof HtmlImage> = {
    title: "Components/HtmlImage",
    component: HtmlImage,
    tags: ["autodocs"],
    args: {
        width: sectionInnerWidth,
        height: 268,
        alt: "Placeholder image",
    },
    argTypes: {
        src: { control: false },
    },
};

export default config;

export const Default: Story = {
    render: (args) => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlImage {...args} src={`https://picsum.photos/seed/html-image/${args.width}/${args.height}`} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const FullWidth: Story = {
    args: {
        width: defaultTheme.sizes.bodyWidth,
        height: 300,
    },
    render: (args) => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlImage {...args} src={`https://picsum.photos/seed/html-image-full-width/${args.width}/${args.height}`} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};
