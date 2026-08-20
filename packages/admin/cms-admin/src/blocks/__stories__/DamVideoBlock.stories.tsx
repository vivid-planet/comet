import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, waitFor } from "storybook/test";

import { createDamVideoBlock, type DamVideoBlockState } from "../createDamVideoBlock";

function StatePreview({ state }: { state: DamVideoBlockState }) {
    return (
        <Box component="pre" data-testid="state" sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", fontSize: 12, overflow: "auto", borderRadius: 1 }}>
            {JSON.stringify(state, null, 2)}
        </Box>
    );
}

function StoryWrapper({ children, state }: { children: ReactNode; state: DamVideoBlockState }) {
    return (
        <>
            {children}
            <StatePreview state={state} />
        </>
    );
}

function readState(canvas: { getByTestId: (id: string) => HTMLElement }): DamVideoBlockState {
    return JSON.parse(canvas.getByTestId("state").textContent ?? "{}");
}

const DamVideoBlock = createDamVideoBlock();

function DamVideoBlockStory() {
    const [state, setState] = useState<DamVideoBlockState>(DamVideoBlock.defaultValues());

    return (
        <StoryWrapper state={state}>
            <DamVideoBlock.AdminComponent state={state} updateState={setState} />
        </StoryWrapper>
    );
}

const config: Meta<typeof DamVideoBlockStory> = {
    component: DamVideoBlockStory,
    title: "blocks/DamVideoBlock",
};

export default config;

type Story = StoryObj<typeof config>;

export const Default: Story = {
    play: async ({ canvas, userEvent, step }) => {
        await step("All video options are offered", async () => {
            await waitFor(() => {
                expect(canvas.getByRole("switch", { name: "Autoplay" })).toBeInTheDocument();
            });

            expect(canvas.getByRole("switch", { name: "Loop" })).toBeInTheDocument();
            expect(canvas.getByRole("switch", { name: "Show controls" })).toBeInTheDocument();
        });

        await step("Switching off show controls enables autoplay, as a video needs at least one of them", async () => {
            await userEvent.click(canvas.getByRole("switch", { name: "Show controls" }));

            await waitFor(() => {
                expect(readState(canvas)).toMatchObject({ autoplay: true, showControls: false });
            });
        });
    },
};

const WithoutAutoplayBlock = createDamVideoBlock({ supports: ["loop", "showControls"] });

function WithoutAutoplayStory() {
    const [state, setState] = useState<DamVideoBlockState>(WithoutAutoplayBlock.defaultValues());

    return (
        <StoryWrapper state={state}>
            <WithoutAutoplayBlock.AdminComponent state={state} updateState={setState} />
        </StoryWrapper>
    );
}

export const WithoutAutoplay: StoryObj<typeof WithoutAutoplayStory> = {
    render: () => <WithoutAutoplayStory />,
    play: async ({ canvas, userEvent, step }) => {
        await step("Autoplay isn't offered, the remaining options are", async () => {
            await waitFor(() => {
                expect(canvas.getByRole("switch", { name: "Loop" })).toBeInTheDocument();
            });

            expect(canvas.queryByRole("switch", { name: "Autoplay" })).not.toBeInTheDocument();
            expect(canvas.getByRole("switch", { name: "Show controls" })).toBeInTheDocument();
        });

        await step("Switching off show controls doesn't enable the unsupported autoplay", async () => {
            await userEvent.click(canvas.getByRole("switch", { name: "Show controls" }));

            await waitFor(() => {
                expect(readState(canvas)).toMatchObject({ showControls: false });
            });

            expect(readState(canvas).autoplay).toBeUndefined();
        });
    },
};
