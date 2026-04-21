import { Box, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { type HTMLAttributes, type ReactNode, useState } from "react";
import { expect, waitFor, within } from "storybook/test";

import { createTipTapRichTextBlock, type TipTapRichTextBlockState } from "../createTipTapRichTextBlock";

function StatePreview({ state }: { state: TipTapRichTextBlockState }) {
    return (
        <Box component="pre" sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", fontSize: 12, overflow: "auto", borderRadius: 1 }}>
            {JSON.stringify(state, null, 2)}
        </Box>
    );
}

function StoryWrapper({ children, state }: { children: ReactNode; state: TipTapRichTextBlockState }) {
    return (
        <>
            {children}
            <StatePreview state={state} />
        </>
    );
}

const TipTapRichTextBlock = createTipTapRichTextBlock();

function TipTapRichTextBlockStory() {
    const [state, setState] = useState<TipTapRichTextBlockState>(TipTapRichTextBlock.defaultValues());

    return (
        <StoryWrapper state={state}>
            <TipTapRichTextBlock.AdminComponent state={state} updateState={setState} />
        </StoryWrapper>
    );
}

const config: Meta<typeof TipTapRichTextBlockStory> = {
    component: TipTapRichTextBlockStory,
    title: "blocks/TipTapRichTextBlock",
};

export default config;

type Story = StoryObj<typeof config>;

export const Default: Story = {
    play: async ({ canvas, step }) => {
        await step("Editor is ready with toolbar", async () => {
            await waitFor(
                () => {
                    expect(canvas.getByRole("textbox")).toBeInTheDocument();
                },
                { timeout: 5000 },
            );

            // Heading select shows "Default"
            expect(canvas.getByRole("combobox")).toBeInTheDocument();
            expect(canvas.getByText("Default")).toBeInTheDocument();

            // Toolbar has buttons (undo, redo, bold, italic, strike, more, ol, ul, indent, dedent, nbsp, shy)
            const buttons = canvas.getAllByRole("button");
            expect(buttons.length).toBeGreaterThanOrEqual(10);
        });

        await step("Undo/redo are disabled initially", async () => {
            const buttons = canvas.getAllByRole("button");
            // First two buttons are undo and redo
            expect(buttons[0]).toBeDisabled();
            expect(buttons[1]).toBeDisabled();
        });
    },
};

const BoldOnlyBlock = createTipTapRichTextBlock({ supports: ["bold"] });

function BoldOnlyStory() {
    const [state, setState] = useState<TipTapRichTextBlockState>(BoldOnlyBlock.defaultValues());

    return (
        <StoryWrapper state={state}>
            <BoldOnlyBlock.AdminComponent state={state} updateState={setState} />
        </StoryWrapper>
    );
}

export const BoldOnly: StoryObj<typeof BoldOnlyStory> = {
    render: () => <BoldOnlyStory />,
    play: async ({ canvas, step }) => {
        await step("Editor is ready with minimal toolbar", async () => {
            await waitFor(
                () => {
                    expect(canvas.getByRole("textbox")).toBeInTheDocument();
                },
                { timeout: 5000 },
            );

            // Only bold button, no heading select
            expect(canvas.queryByRole("combobox")).not.toBeInTheDocument();
            expect(canvas.queryByText("Default")).not.toBeInTheDocument();

            // Exactly 1 button (bold only — no undo/redo, no lists, no special chars)
            const buttons = canvas.getAllByRole("button");
            expect(buttons).toHaveLength(1);
        });
    },
};

const BlockStylesBlock = createTipTapRichTextBlock({
    blockStyles: [
        {
            name: "large-heading",
            label: "Large Heading",
            appliesTo: ["heading-1", "heading-2"],
            element: (p) => <Typography sx={{ fontSize: 48, lineHeight: 1.2 }} variant="h1" {...p} />,
        },
        {
            name: "intro",
            label: "Intro Text",
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 20, fontStyle: "italic" }} {...props} />,
        },
        {
            name: "highlight",
            label: "Highlight",
            element: (props: HTMLAttributes<HTMLElement>) => <div style={{ backgroundColor: "#fff3cd", padding: 8 }} {...props} />,
        },
    ],
});

function BlockStylesStory() {
    const [state, setState] = useState<TipTapRichTextBlockState>(BlockStylesBlock.defaultValues());

    return (
        <StoryWrapper state={state}>
            <BlockStylesBlock.AdminComponent state={state} updateState={setState} />
        </StoryWrapper>
    );
}

export const BlockStyles: StoryObj<typeof BlockStylesStory> = {
    render: () => <BlockStylesStory />,
    play: async ({ canvas, userEvent, step }) => {
        await step("Editor is ready with block style dropdown", async () => {
            await waitFor(
                () => {
                    expect(canvas.getByRole("textbox")).toBeInTheDocument();
                },
                { timeout: 5000 },
            );

            // Both heading select and block style select show "Default"
            const comboboxes = canvas.getAllByRole("combobox");
            expect(comboboxes).toHaveLength(2);

            const defaults = canvas.getAllByText("Default");
            expect(defaults.length).toBeGreaterThanOrEqual(2);
        });

        await step("Select block style 'Intro Text'", async () => {
            // Click the second combobox (block style select)
            const comboboxes = canvas.getAllByRole("combobox");
            await userEvent.click(comboboxes[1]);

            await waitFor(
                () => {
                    const introOption = within(document.body).getByText("Intro Text");
                    expect(introOption).toBeInTheDocument();
                },
                { timeout: 3000 },
            );

            const introOption = within(document.body).getByText("Intro Text");
            await userEvent.click(introOption);

            await waitFor(
                () => {
                    expect(canvas.getByText("Intro Text")).toBeInTheDocument();
                },
                { timeout: 3000 },
            );
        });
    },
};

const BlockStyleInteractionsBlock = createTipTapRichTextBlock({
    blockStyles: [
        {
            name: "chapter-heading",
            label: "Chapter Heading",
            appliesTo: ["heading-1"],
            element: (props: HTMLAttributes<HTMLElement>) => <h1 style={{ textTransform: "uppercase", letterSpacing: "0.1em" }} {...props} />,
        },
        {
            name: "large-heading",
            label: "Large Heading",
            appliesTo: ["heading-1", "heading-2"],
            element: (p) => <Typography sx={{ fontSize: 48, lineHeight: 1.2 }} variant="h1" {...p} />,
        },
        {
            name: "intro",
            label: "Intro Text",
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 20, fontStyle: "italic" }} {...props} />,
        },
        {
            name: "highlight",
            label: "Highlight",
            element: (props: HTMLAttributes<HTMLElement>) => <div style={{ backgroundColor: "#fff3cd", padding: 8 }} {...props} />,
        },
    ],
});

function BlockStyleInteractionsStory() {
    const [state, setState] = useState<TipTapRichTextBlockState>(BlockStyleInteractionsBlock.defaultValues());

    return (
        <StoryWrapper state={state}>
            <BlockStyleInteractionsBlock.AdminComponent state={state} updateState={setState} />
        </StoryWrapper>
    );
}

export const BlockStyleInteractions: StoryObj<typeof BlockStyleInteractionsStory> = {
    render: () => <BlockStyleInteractionsStory />,
    play: async ({ canvas, userEvent, step }) => {
        await step("Editor is ready", async () => {
            await waitFor(
                () => {
                    expect(canvas.getByRole("textbox")).toBeInTheDocument();
                },
                { timeout: 5000 },
            );
        });

        await step("Select Heading 1", async () => {
            const blockTypeSelect = canvas.getAllByRole("combobox")[0];
            await userEvent.click(blockTypeSelect);

            await waitFor(
                () => {
                    expect(within(document.body).getByText("Heading 1")).toBeInTheDocument();
                },
                { timeout: 3000 },
            );
            await userEvent.click(within(document.body).getByText("Heading 1"));

            await waitFor(
                () => {
                    expect(canvas.getAllByRole("combobox")[0]).toHaveTextContent("Heading 1");
                },
                { timeout: 3000 },
            );
        });

        await step("Verify available styles for Heading 1: Chapter Heading, Large Heading, Highlight — but not Intro Text", async () => {
            const blockStyleSelect = canvas.getAllByRole("combobox")[1];
            await userEvent.click(blockStyleSelect);

            await waitFor(
                () => {
                    const body = within(document.body);
                    expect(body.getByText("Chapter Heading")).toBeInTheDocument();
                    expect(body.getByText("Large Heading")).toBeInTheDocument();
                    expect(body.getByText("Highlight")).toBeInTheDocument();
                    expect(body.queryByText("Intro Text")).not.toBeInTheDocument();
                },
                { timeout: 3000 },
            );
        });

        await step("Select 'Chapter Heading' style (heading-1 only)", async () => {
            await userEvent.click(within(document.body).getByText("Chapter Heading"));

            await waitFor(
                () => {
                    expect(canvas.getAllByRole("combobox")[1]).toHaveTextContent("Chapter Heading");
                },
                { timeout: 3000 },
            );
        });

        await step("Verify chapter heading styling is applied (uppercase)", async () => {
            await waitFor(
                () => {
                    const styledEl = document.querySelector('[data-block-style="chapter-heading"]');
                    expect(styledEl).toBeTruthy();
                    expect(styledEl).toHaveStyle({ textTransform: "uppercase" });
                },
                { timeout: 3000 },
            );
        });

        await step("Switch to Heading 2", async () => {
            const blockTypeSelect = canvas.getAllByRole("combobox")[0];
            await userEvent.click(blockTypeSelect);

            await waitFor(
                () => {
                    expect(within(document.body).getByText("Heading 2")).toBeInTheDocument();
                },
                { timeout: 3000 },
            );
            await userEvent.click(within(document.body).getByText("Heading 2"));

            await waitFor(
                () => {
                    expect(canvas.getAllByRole("combobox")[0]).toHaveTextContent("Heading 2");
                },
                { timeout: 3000 },
            );
        });

        await step("Block style auto-resets to Default (Chapter Heading doesn't apply to heading-2)", async () => {
            await waitFor(
                () => {
                    expect(canvas.getAllByRole("combobox")[1]).toHaveTextContent("Default");
                },
                { timeout: 3000 },
            );
        });

        await step("Verify chapter heading styling is removed", async () => {
            await waitFor(
                () => {
                    expect(document.querySelector("[data-block-style]")).toBeNull();
                },
                { timeout: 3000 },
            );
        });
    },
};

const ListLevelMaxBlock = createTipTapRichTextBlock({ supports: ["ordered-list", "unordered-list"], listLevelMax: 2 });

function ListLevelMaxStory() {
    const [state, setState] = useState<TipTapRichTextBlockState>({
        tipTapContent: {
            type: "doc",
            content: [
                {
                    type: "bulletList",
                    content: [
                        {
                            type: "listItem",
                            content: [{ type: "paragraph", content: [{ type: "text", text: "Level 1 - first" }] }],
                        },
                        {
                            type: "listItem",
                            content: [
                                { type: "paragraph", content: [{ type: "text", text: "Level 1 - second" }] },
                                {
                                    type: "bulletList",
                                    content: [
                                        {
                                            type: "listItem",
                                            content: [{ type: "paragraph", content: [{ type: "text", text: "Level 2 (max)" }] }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    });

    return (
        <StoryWrapper state={state}>
            <ListLevelMaxBlock.AdminComponent state={state} updateState={setState} />
        </StoryWrapper>
    );
}

export const ListLevelMax: StoryObj<typeof ListLevelMaxStory> = {
    render: () => <ListLevelMaxStory />,
    play: async ({ canvas, userEvent, step }) => {
        await step("Editor is ready with list content", async () => {
            await waitFor(
                () => {
                    expect(canvas.getByRole("textbox")).toBeInTheDocument();
                },
                { timeout: 5000 },
            );
        });

        await step("Click on the deepest nested list item (level 2) - indent should be disabled", async () => {
            const textbox = canvas.getByRole("textbox");
            const nestedText = within(textbox).getByText("Level 2 (max)");
            await userEvent.click(nestedText);

            await waitFor(
                () => {
                    // At max depth, the indent button should be disabled
                    const buttons = canvas.getAllByRole("button");
                    const disabledButtons = buttons.filter((btn) => btn.hasAttribute("disabled"));
                    expect(disabledButtons.length).toBeGreaterThanOrEqual(1);
                },
                { timeout: 3000 },
            );
        });

        await step("Tab key does not indent at max depth", async () => {
            const textbox = canvas.getByRole("textbox");
            // Ensure we're still on the max-depth item
            const nestedText = within(textbox).getByText("Level 2 (max)");
            await userEvent.click(nestedText);

            // Count nested lists before Tab (should be 2 levels: outer bulletList > inner bulletList)
            const nestedListsBefore = textbox.querySelectorAll("ul ul, ol ol, ul ol, ol ul").length;

            await userEvent.keyboard("{Tab}");

            // After Tab, nesting should not have increased
            await waitFor(
                () => {
                    const nestedListsAfter = textbox.querySelectorAll("ul ul, ol ol, ul ol, ol ul").length;
                    expect(nestedListsAfter).toBe(nestedListsBefore);
                },
                { timeout: 3000 },
            );
        });

        await step("Click on 'Level 1 - second' - indent should be enabled (below max depth)", async () => {
            const textbox = canvas.getByRole("textbox");
            const secondItem = within(textbox).getByText("Level 1 - second");
            await userEvent.click(secondItem);

            // At level 1, sinkListItem is possible because there's a preceding sibling,
            // and listLevelMax is 2 so depth 1 < 2. Indent should be enabled.
            await waitFor(
                () => {
                    const buttons = canvas.getAllByRole("button");
                    // With supports: ["ordered-list", "unordered-list"], buttons are: OL, UL, Indent+, Indent-
                    const indentButton = buttons[2];
                    expect(indentButton).not.toBeDisabled();
                },
                { timeout: 3000 },
            );
        });

        await step("Tab key indents at level below max", async () => {
            const textbox = canvas.getByRole("textbox");

            // Count nested lists before Tab
            const nestedListsBefore = textbox.querySelectorAll("ul ul, ol ol, ul ol, ol ul").length;

            await userEvent.keyboard("{Tab}");

            // After Tab, nesting should have increased by 1
            await waitFor(
                () => {
                    const nestedListsAfter = textbox.querySelectorAll("ul ul, ol ol, ul ol, ol ul").length;
                    expect(nestedListsAfter).toBe(nestedListsBefore + 1);
                },
                { timeout: 3000 },
            );
        });

        await step("Clipboard paste does not create list nesting exceeding max depth", async () => {
            const textbox = canvas.getByRole("textbox");
            // Click the max-depth item
            const nestedText = within(textbox).getByText("Level 2 (max)");
            await userEvent.click(nestedText);

            // Dispatch a paste event containing nested list HTML that would exceed the max depth
            const clipboardData = new DataTransfer();
            clipboardData.setData("text/html", "<ul><li>pasted<ul><li>would be level 3</li></ul></li></ul>");
            clipboardData.setData("text/plain", "pasted would be level 3");
            textbox.dispatchEvent(new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true }));

            await waitFor(
                () => {
                    // Triple-nested lists (ul/ol > ul/ol > ul/ol) must not appear
                    const tripleNested = textbox.querySelectorAll("ul ul ul, ol ol ol, ul ul ol, ul ol ul, ol ul ul, ol ul ol, ol ol ul");
                    expect(tripleNested.length).toBe(0);
                },
                { timeout: 3000 },
            );
        });
    },
};
