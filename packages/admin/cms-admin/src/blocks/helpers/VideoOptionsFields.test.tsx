import userEvent from "@testing-library/user-event";
import { Form } from "react-final-form";
import { cleanup, render, screen } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { VideoOptionsFields, type VideoOptionsSupports } from "./VideoOptionsFields";

type Values = { autoplay?: boolean; loop?: boolean; showControls?: boolean };

function renderVideoOptionsFields({ supports, initialValues }: { supports?: VideoOptionsSupports[]; initialValues?: Values } = {}) {
    const values: Values = {};

    render(
        <Form<Values> onSubmit={() => undefined} initialValues={initialValues}>
            {({ values: formValues }) => {
                Object.assign(values, formValues);
                return <VideoOptionsFields supports={supports} />;
            }}
        </Form>,
    );

    return values;
}

describe("VideoOptionsFields", () => {
    afterEach(() => {
        cleanup();
    });

    it("should show all options by default", () => {
        renderVideoOptionsFields();

        expect(screen.queryByLabelText("Autoplay")).not.toBeNull();
        expect(screen.queryByLabelText("Loop")).not.toBeNull();
        expect(screen.queryByLabelText("Show controls")).not.toBeNull();
    });

    it("should only show supported options", () => {
        renderVideoOptionsFields({ supports: ["loop", "showControls"] });

        expect(screen.queryByLabelText("Autoplay")).toBeNull();
        expect(screen.queryByLabelText("Loop")).not.toBeNull();
        expect(screen.queryByLabelText("Show controls")).not.toBeNull();
    });

    it("should enable showControls when autoplay is switched off", async () => {
        const values = renderVideoOptionsFields({ initialValues: { autoplay: true, showControls: false } });

        await userEvent.click(screen.getByLabelText("Autoplay"));

        expect(values).toMatchObject({ autoplay: false, showControls: true });
    });

    it("should not enable autoplay when it isn't supported", async () => {
        const values = renderVideoOptionsFields({ supports: ["showControls"], initialValues: { showControls: true } });

        await userEvent.click(screen.getByLabelText("Show controls"));

        expect(values.showControls).toBe(false);
        expect(values.autoplay).toBeUndefined();
    });
});
