import { MjmlColumn, MjmlRaw } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { createTheme } from "../../../theme/createTheme.js";
import { MjmlSection } from "../../section/MjmlSection.js";
import { HtmlText } from "../HtmlText.js";

type Story = StoryObj<typeof HtmlText>;

const config: Meta<typeof HtmlText> = {
    title: "Components/HtmlText",
    component: HtmlText,
    tags: ["autodocs"],
};

export default config;

export const Default: Story = {
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlRaw>
                    <table role="presentation" cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                        <tr>
                            <HtmlText>Default text with base theme styles</HtmlText>
                        </tr>
                    </table>
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const WithVariants: Story = {
    parameters: {
        theme: createTheme({
            text: {
                variants: {
                    heading: { fontSize: "32px", fontWeight: 700, lineHeight: "40px" },
                    body: { fontSize: "16px", lineHeight: "24px" },
                    caption: { fontSize: "12px", lineHeight: "16px", color: "#666666" },
                },
            },
        }),
    },
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlRaw>
                    <table role="presentation" cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                        <tr>
                            <HtmlText variant="heading">Heading variant</HtmlText>
                        </tr>
                        <tr>
                            <HtmlText variant="body">Body variant</HtmlText>
                        </tr>
                        <tr>
                            <HtmlText variant="caption">Caption variant</HtmlText>
                        </tr>
                    </table>
                </MjmlRaw>
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
                        fontSize: { default: "32px", mobile: "24px" },
                        lineHeight: { default: "40px", mobile: "30px" },
                        fontWeight: 700,
                    },
                },
            },
        }),
    },
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlRaw>
                    <table role="presentation" cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                        <tr>
                            <HtmlText variant="heading">Responsive heading — shrinks on mobile</HtmlText>
                        </tr>
                    </table>
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const BottomSpacing: Story = {
    parameters: {
        theme: createTheme({
            text: {
                bottomSpacing: "20px",
                variants: {
                    heading: { fontSize: "32px", fontWeight: 700, bottomSpacing: { default: "24px", mobile: "16px" } },
                },
            },
        }),
    },
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlRaw>
                    <table role="presentation" cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                        <tr>
                            <HtmlText variant="heading" bottomSpacing>
                                Heading with bottom spacing
                            </HtmlText>
                        </tr>
                        <tr>
                            <HtmlText bottomSpacing>Base text with bottom spacing</HtmlText>
                        </tr>
                        <tr>
                            <HtmlText>Text without bottom spacing</HtmlText>
                        </tr>
                    </table>
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

export const InsideMjmlRaw: Story = {
    render: () => (
        <MjmlSection>
            <MjmlColumn>
                <MjmlRaw>
                    <table role="presentation" cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                        <tr>
                            <HtmlText>HtmlText inside MjmlRaw — for custom HTML table layouts</HtmlText>
                        </tr>
                    </table>
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};
