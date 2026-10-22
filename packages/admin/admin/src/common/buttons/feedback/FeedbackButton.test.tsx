import { Save } from "@dextinity/admin-icons";
import { act, cleanup, fireEvent, render, screen } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { FeedbackButton } from "./FeedbackButton";

describe("FeedbackButton", () => {
    afterEach(() => {
        cleanup();
    });

    it("is disabled but stays focusable while loading", () => {
        render(
            <FeedbackButton loading startIcon={<Save />}>
                Save
            </FeedbackButton>,
        );

        const button = screen.getByRole("button", { name: "Save" });
        expect(button).toHaveAttribute("data-disabled");
        expect(button).toHaveAttribute("aria-busy", "true");
        expect(button).toHaveAttribute("data-feedback", "loading");
        expect(button).not.toHaveAttribute("disabled");
    });

    it("reports a failed action in a tooltip", async () => {
        render(
            <FeedbackButton
                startIcon={<Save />}
                tooltipErrorMessage="Saving failed"
                onClick={() => {
                    throw new Error("Failed");
                }}
            >
                Save
            </FeedbackButton>,
        );

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "Save" }));
        });

        expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-feedback", "error");
        expect(await screen.findByText("Saving failed")).toBeInTheDocument();
    });
});
