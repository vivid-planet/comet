import { MjmlColumn } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { defaultTheme } from "../../../theme/defaultTheme.js";
import { getDefaultFromResponsiveValue } from "../../../theme/responsiveValue.js";
import { MjmlSection } from "../../section/MjmlSection.js";
import { MjmlImage } from "../MjmlImage.js";

type Story = StoryObj<typeof MjmlImage>;

const sectionIndent = getDefaultFromResponsiveValue(defaultTheme.sizes.contentIndentation);
const sectionInnerWidth = defaultTheme.sizes.bodyWidth - 2 * sectionIndent;

const config: Meta<typeof MjmlImage> = {
    title: "Components/MjmlImage",
    component: MjmlImage,
    tags: ["autodocs"],
    args: {
        src: `https://picsum.photos/seed/mjml-image/${sectionInnerWidth}/268`,
        width: sectionInnerWidth,
        height: 268,
        alt: "Placeholder image",
    },
};

export default config;

export const Default: Story = {
    render: (args) => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlImage {...args} />
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const FullWidth: Story = {
    args: {
        src: `https://picsum.photos/seed/mjml-image-full-width/${defaultTheme.sizes.bodyWidth}/300`,
        width: defaultTheme.sizes.bodyWidth,
        height: 300,
    },
    render: (args) => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlImage {...args} />
            </MjmlColumn>
        </MjmlSection>
    ),
};
