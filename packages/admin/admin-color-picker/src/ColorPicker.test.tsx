import { MuiThemeProvider } from "@comet/admin";
import { createTheme } from "@mui/material";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ColorPicker } from "./ColorPicker";

const theme = createTheme();

function TestWrapper({ children }: { children?: ReactNode }) {
    return (
        <IntlProvider locale="en" messages={{}}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </IntlProvider>
    );
}

function renderColorPicker(ui: ReactElement) {
    render(ui, { wrapper: TestWrapper });

    return screen.getByRole("textbox") as HTMLInputElement;
}

describe("ColorPicker", () => {
    afterEach(cleanup);

    it("shows the passed value in the input", () => {
        const input = renderColorPicker(<ColorPicker value="#ff0000" />);

        expect(input.value).toBe("#ff0000");
    });

    it("normalizes a typed color to hex on blur", async () => {
        const onChange = vi.fn();
        const input = renderColorPicker(<ColorPicker onChange={onChange} />);

        fireEvent.change(input, { target: { value: "red" } });
        fireEvent.blur(input);

        // `onChange` is debounced by 250ms to keep the picker responsive while sliding.
        await waitFor(() => expect(onChange).toHaveBeenCalledWith("#ff0000"));
        expect(input.value).toBe("#ff0000");
    });

    it("normalizes a typed color to an rgb string when colorFormat is rgba", async () => {
        const onChange = vi.fn();
        const input = renderColorPicker(<ColorPicker colorFormat="rgba" onChange={onChange} />);

        fireEvent.change(input, { target: { value: "red" } });
        fireEvent.blur(input);

        await waitFor(() => expect(onChange).toHaveBeenCalledWith("rgb(255, 0, 0)"));
        expect(input.value).toBe("rgb(255, 0, 0)");
    });

    it("clears the value when an invalid color is typed", async () => {
        const onChange = vi.fn();
        const input = renderColorPicker(<ColorPicker onChange={onChange} />);

        fireEvent.change(input, { target: { value: "not-a-color" } });
        fireEvent.blur(input);

        await waitFor(() => expect(onChange).toHaveBeenCalledWith(null));
        expect(input.value).toBe("");
    });

    it("keeps the typed value in the input until it is blurred", () => {
        const onChange = vi.fn();
        const input = renderColorPicker(<ColorPicker onChange={onChange} />);

        fireEvent.change(input, { target: { value: "re" } });

        expect(input.value).toBe("re");
        expect(onChange).not.toHaveBeenCalled();
    });

    describe("preview", () => {
        const previewComponents = {
            ColorPickerColorPreview: ({ color }: { color?: string }) => <span data-testid="preview" data-preview="color" data-color={color} />,
            ColorPickerInvalidPreview: () => <span data-testid="preview" data-preview="invalid" />,
            ColorPickerEmptyPreview: () => <span data-testid="preview" data-preview="empty" />,
        };

        it("renders the empty preview without a value", () => {
            renderColorPicker(<ColorPicker components={previewComponents} />);

            expect(screen.getByTestId("preview").dataset.preview).toBe("empty");
        });

        it("renders the color preview for a valid value", () => {
            renderColorPicker(<ColorPicker value="#ff0000" components={previewComponents} />);

            expect(screen.getByTestId("preview").dataset.preview).toBe("color");
            expect(screen.getByTestId("preview").dataset.color).toBe("rgb(255, 0, 0)");
        });

        it("renders the invalid preview for an invalid value", () => {
            renderColorPicker(<ColorPicker value="not-a-color" components={previewComponents} />);

            expect(screen.getByTestId("preview").dataset.preview).toBe("invalid");
        });
    });
});
