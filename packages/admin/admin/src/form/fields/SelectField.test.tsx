import { Form } from "react-final-form";
import { cleanup, render, screen } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SelectField } from "./SelectField";

describe("SelectField", () => {
    afterEach(cleanup);

    // Note: These tests describe a feature not only of SelectField but also of other fields using FieldContainer/Field
    it("the prop data-testid should render a data-testid on component root", () => {
        render(
            <Form onSubmit={vi.fn()}>
                {() => (
                    <SelectField
                        name="test"
                        data-testid="test-select"
                        options={[
                            { label: "Option 1", value: "1" },
                            { label: "Option 2", value: "2" },
                        ]}
                    />
                )}
            </Form>,
        );

        const selectField = screen.getByTestId("test-select");
        expect(selectField).toBeInTheDocument();
        expect(selectField.tagName).toBe("DIV");
    });

    it("should render data-testid on the component when setting it in the componentsProps", () => {
        render(
            <Form onSubmit={vi.fn()}>
                {() => (
                    <SelectField
                        name="test"
                        componentsProps={{
                            finalFormSelect: { inputProps: { "data-testid": "test-select" } },
                        }}
                        options={[
                            { label: "Option 1", value: "1" },
                            { label: "Option 2", value: "2" },
                        ]}
                    />
                )}
            </Form>,
        );

        const selectField = screen.getByTestId("test-select");
        expect(selectField).toBeInTheDocument();
        expect(selectField.tagName).toBe("INPUT");
    });
});
