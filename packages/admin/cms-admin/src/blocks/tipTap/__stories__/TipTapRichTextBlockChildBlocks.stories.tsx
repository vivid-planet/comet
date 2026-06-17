import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, waitFor, within } from "storybook/test";

import { createBlockSkeleton } from "../../helpers/createBlockSkeleton";
import { BlockCategory, type BlockInterface } from "../../types";
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

type ExampleChildBlockState = { label: string };

const ExampleChildBlock: BlockInterface<ExampleChildBlockState, ExampleChildBlockState, ExampleChildBlockState> = {
    ...createBlockSkeleton(),
    name: "ExampleChild",
    displayName: "Example Child",
    category: BlockCategory.Other,
    defaultValues: () => ({ label: "" }),
    AdminComponent: ({ state, updateState }) => (
        <input aria-label="Label" value={state.label} onChange={(event) => updateState({ label: event.target.value })} placeholder="Enter a label" />
    ),
    previewContent: (state) => (state.label ? [{ type: "text", content: state.label }] : []),
};

const ExampleInlineChildBlock: BlockInterface<ExampleChildBlockState, ExampleChildBlockState, ExampleChildBlockState> = {
    ...ExampleChildBlock,
    name: "ExampleInlineChild",
    displayName: "Example Inline Child",
};

const ChildBlocksBlock = createTipTapRichTextBlock({
    childBlocks: [ExampleChildBlock, { block: ExampleInlineChildBlock, display: "inline" }],
});

function ChildBlocksStory() {
    const [state, setState] = useState<TipTapRichTextBlockState>(ChildBlocksBlock.defaultValues());

    return (
        <StoryWrapper state={state}>
            <ChildBlocksBlock.AdminComponent state={state} updateState={setState} />
        </StoryWrapper>
    );
}

const config: Meta<typeof ChildBlocksStory> = {
    component: ChildBlocksStory,
    title: "blocks/TipTapRichTextBlock/ChildBlocks",
};

export default config;

export const ChildBlocks: StoryObj<typeof ChildBlocksStory> = {
    render: () => <ChildBlocksStory />,
    play: async ({ canvas, userEvent, step }) => {
        await step("Editor is ready", async () => {
            await waitFor(
                () => {
                    expect(canvas.getByRole("textbox")).toBeInTheDocument();
                },
                { timeout: 5000 },
            );
        });

        await step("Insert-block button opens a menu listing the block and inline child blocks", async () => {
            await userEvent.click(canvas.getByRole("button", { name: "Insert block" }));

            // The menu is rendered in a portal, so it lives in document.body rather than within the canvas
            await waitFor(
                () => {
                    expect(within(document.body).getByRole("menuitem", { name: "Example Child" })).toBeInTheDocument();
                    expect(within(document.body).getByRole("menuitem", { name: "Example Inline Child" })).toBeInTheDocument();
                },
                { timeout: 3000 },
            );
        });

        await step("Selecting an inline child block opens its dialog", async () => {
            await userEvent.click(within(document.body).getByRole("menuitem", { name: "Example Inline Child" }));

            await waitFor(
                () => {
                    expect(within(document.body).getByLabelText("Label")).toBeInTheDocument();
                },
                { timeout: 3000 },
            );
        });

        await step("Inserting an inline child block renders its preview inline within the text", async () => {
            await userEvent.type(within(document.body).getByLabelText("Label"), "Inline preview");
            await userEvent.click(within(document.body).getByRole("button", { name: "OK" }));

            await waitFor(
                () => {
                    // The inline preview sits inside a paragraph (text flow), unlike a block-level child block
                    expect(canvas.getByText("Inline preview").closest("p")).toBeInTheDocument();
                },
                { timeout: 3000 },
            );
        });
    },
};

export const BlockChildBlock: StoryObj<typeof ChildBlocksStory> = {
    render: () => <ChildBlocksStory />,
    play: async ({ canvas, userEvent, step }) => {
        await step("Editor is ready", async () => {
            await waitFor(
                () => {
                    expect(canvas.getByRole("textbox")).toBeInTheDocument();
                },
                { timeout: 5000 },
            );
        });

        await step("Selecting a block-level child block opens its dialog", async () => {
            await userEvent.click(canvas.getByRole("button", { name: "Insert block" }));

            // The menu is rendered in a portal, so it lives in document.body rather than within the canvas
            await waitFor(
                () => {
                    expect(within(document.body).getByRole("menuitem", { name: "Example Child" })).toBeInTheDocument();
                },
                { timeout: 3000 },
            );

            await userEvent.click(within(document.body).getByRole("menuitem", { name: "Example Child" }));

            await waitFor(
                () => {
                    expect(within(document.body).getByLabelText("Label")).toBeInTheDocument();
                },
                { timeout: 3000 },
            );
        });

        await step("Inserting a block-level child block renders its preview as a standalone block", async () => {
            await userEvent.type(within(document.body).getByLabelText("Label"), "Block preview");
            await userEvent.click(within(document.body).getByRole("button", { name: "OK" }));

            await waitFor(
                () => {
                    // The block-level preview is a boxed row showing the block's display name as a title,
                    // unlike the inline chip which only renders the preview text in the text flow
                    expect(canvas.getByText("Example Child")).toBeInTheDocument();
                    expect(canvas.getByText("Block preview")).toBeInTheDocument();
                },
                { timeout: 3000 },
            );
        });
    },
};
