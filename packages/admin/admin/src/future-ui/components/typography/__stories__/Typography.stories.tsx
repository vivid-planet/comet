import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../button/Button";
import { Typography } from "../Typography";

const meta: Meta<typeof Typography> = {
    component: Typography,
    title: "Future UI/Typography",
    argTypes: {
        variant: {
            control: "select",
            options: ["headline", "body"],
        },
        element: {
            control: "select",
            options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"],
        },
    },
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
    args: {
        children: "The quick brown fox jumps over the lazy dog",
    },
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Typography variant="headline">Headline</Typography>
            <Typography variant="body">Body — the quick brown fox jumps over the lazy dog.</Typography>
        </div>
    ),
};

/**
 * A full type scale showing all variants with realistic content,
 * rendered across heading levels.
 */
export const TypeScale: Story = {
    render: () => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                maxWidth: 640,
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <Typography
                    variant="body"
                    element="span"
                    style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}
                >
                    Headline · h1
                </Typography>
                <Typography variant="headline" element="h1" style={{ fontSize: "2.5rem" }}>
                    Page Title
                </Typography>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <Typography
                    variant="body"
                    element="span"
                    style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}
                >
                    Headline · h2
                </Typography>
                <Typography variant="headline" element="h2">
                    Section Heading
                </Typography>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <Typography
                    variant="body"
                    element="span"
                    style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}
                >
                    Headline · h3
                </Typography>
                <Typography variant="headline" element="h3" style={{ fontSize: "1.25rem" }}>
                    Subsection Heading
                </Typography>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <Typography
                    variant="body"
                    element="span"
                    style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}
                >
                    Body · p
                </Typography>
                <Typography variant="body">
                    Body text is used for paragraphs, descriptions, and longer-form content. It should be comfortable to read at length with
                    appropriate line height and spacing.
                </Typography>
            </div>
        </div>
    ),
};

/**
 * Typography in a realistic article layout with headline, body, and nested sections.
 */
export const ArticleLayout: Story = {
    render: () => (
        <div
            style={{
                maxWidth: 600,
                fontFamily: "system-ui, sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
            }}
        >
            <Typography variant="headline" element="h1" style={{ fontSize: "2rem" }}>
                Getting Started with COMET
            </Typography>
            <Typography variant="body" style={{ color: "#555" }}>
                COMET is a content management platform built for modern web experiences. This guide walks you through setting up your first project.
            </Typography>
            <div style={{ height: 1, background: "#e0e0e0" }} />
            <Typography variant="headline" element="h2">
                Prerequisites
            </Typography>
            <Typography variant="body">
                Before you begin, make sure you have Node.js 18 or later installed. You will also need access to a PostgreSQL database for the API
                layer.
            </Typography>
            <Typography variant="headline" element="h2">
                Installation
            </Typography>
            <Typography variant="body">
                Clone the repository and run the install script. This will set up all dependencies and build the required packages for local
                development.
            </Typography>
            <div
                style={{
                    background: "#f5f5f5",
                    borderRadius: 6,
                    padding: "1rem",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: "#333",
                }}
            >
                <code>npx create-comet-app my-project</code>
            </div>
        </div>
    ),
};

/**
 * Typography combined with other Future UI components in a card.
 */
export const ContentCard: Story = {
    render: () => (
        <div
            style={{
                maxWidth: 380,
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                overflow: "hidden",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <div
                style={{
                    height: 160,
                    background: "linear-gradient(135deg, #1976d2 0%, #2e7d32 100%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "1.25rem",
                }}
            >
                <Typography variant="headline" element="h3" style={{ color: "#fff", fontSize: "1.25rem" }}>
                    Featured Article
                </Typography>
            </div>
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Typography variant="body">
                    Discover the new block editor features that make building pages faster and more intuitive than ever.
                </Typography>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="primary">Read More</Button>
                </div>
            </div>
        </div>
    ),
};

/**
 * A dashboard-style stats section using Typography for labels and values.
 */
export const DashboardStats: Story = {
    render: () => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
                maxWidth: 600,
                fontFamily: "system-ui, sans-serif",
            }}
        >
            {[
                { label: "Pages", value: "142" },
                { label: "Published", value: "98" },
                { label: "Drafts", value: "44" },
            ].map(({ label, value }) => (
                <div
                    key={label}
                    style={{
                        padding: "1.25rem",
                        background: "#f9f9f9",
                        borderRadius: 8,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                    }}
                >
                    <Typography variant="headline" element="span" style={{ fontSize: "2rem" }}>
                        {value}
                    </Typography>
                    <Typography variant="body" element="span" style={{ color: "#777", fontSize: "0.875rem" }}>
                        {label}
                    </Typography>
                </div>
            ))}
        </div>
    ),
};

/**
 * Each variant maps to a default semantic element (`h2` for `headline`, `p`
 * for `body`). `element` overrides it when visual level and document outline
 * disagree — for example, a `headline` rendered as an `h1`.
 */
export const WithCustomElement: Story = {
    args: {
        variant: "headline",
        element: "h1",
        children: "Visually headline, semantically h1",
    },
};

/**
 * `render` replaces the root element while keeping Typography's styling. Here a
 * `headline` renders as a `<label>`, with `htmlFor` typed natively.
 */
export const WithRender: Story = {
    args: {
        variant: "headline",
        render: <label htmlFor="email" />,
        children: "Email",
    },
};
