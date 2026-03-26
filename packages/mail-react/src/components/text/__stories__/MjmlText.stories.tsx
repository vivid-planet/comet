import { MjmlColumn } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { createTheme } from "../../../theme/createTheme.js";
import { MjmlSection } from "../../section/MjmlSection.js";
import { MjmlText } from "../MjmlText.js";

type Story = StoryObj<typeof MjmlText>;

const config: Meta<typeof MjmlText> = {
    title: "Components/MjmlText",
    component: MjmlText,
    tags: ["autodocs"],
};

export default config;

export const Default: Story = {
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlText>Default text with base theme styles</MjmlText>
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const WithVariants: Story = {
    parameters: {
        theme: createTheme({
            text: {
                variants: {
                    heading: { fontSize: "24px", fontWeight: "700", lineHeight: "28px" },
                    body: { fontSize: "16px", lineHeight: "24px" },
                    caption: { fontSize: "12px", lineHeight: "16px", color: "#666666" },
                },
            },
        }),
    },
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                {/* @ts-expect-error -- consumers would use module augmentation of TextVariants */}
                <MjmlText variant="heading">Heading variant</MjmlText>
                {/* @ts-expect-error -- consumers would use module augmentation of TextVariants */}
                <MjmlText variant="body">Body variant</MjmlText>
                {/* @ts-expect-error -- consumers would use module augmentation of TextVariants */}
                <MjmlText variant="caption">Caption variant</MjmlText>
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const ResponsiveVariants: Story = {
    parameters: {
        theme: createTheme({
            text: {
                variants: {
                    heading: {
                        fontSize: { default: "24px", mobile: "20px" },
                        lineHeight: { default: "28px", mobile: "24px" },
                        fontWeight: "700",
                    },
                    body: {
                        fontSize: { default: "16px", mobile: "14px" },
                        lineHeight: { default: "24px", mobile: "20px" },
                    },
                },
            },
        }),
    },
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                {/* @ts-expect-error -- consumers would use module augmentation of TextVariants */}
                <MjmlText variant="heading">Responsive heading (24px → 20px on mobile)</MjmlText>
                {/* @ts-expect-error -- consumers would use module augmentation of TextVariants */}
                <MjmlText variant="body">Responsive body (16px → 14px on mobile)</MjmlText>
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const BottomSpacing: Story = {
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlText bottomSpacing>With bottom spacing (16px from theme)</MjmlText>
                <MjmlText>Without bottom spacing</MjmlText>
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const DefaultVariant: Story = {
    parameters: {
        theme: createTheme({
            text: {
                // @ts-expect-error -- consumers would use module augmentation of TextVariants
                defaultVariant: "body",
                variants: {
                    body: { fontSize: "16px", lineHeight: "24px", color: "#333333" },
                    heading: { fontSize: "24px", fontWeight: "700" },
                },
            },
        }),
    },
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlText>Implicit body variant via defaultVariant</MjmlText>
                {/* @ts-expect-error -- consumers would use module augmentation of TextVariants */}
                <MjmlText variant="heading">Explicit heading variant</MjmlText>
            </MjmlColumn>
        </MjmlSection>
    ),
};
