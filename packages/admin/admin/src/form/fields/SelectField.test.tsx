import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";

import { SelectField } from "./SelectField";

describe("SelectField", () => {
    it("the prop data-testid should render a data-testid on component root", () => {
        render(
            <Form onSubmit={jest.fn()}>
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

    it("the prop input-testid should render a data-testid on component hidden input", () => {
        render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <SelectField
                        name="test"
                        input-testid="test-select-input"
                        options={[
                            { label: "Option 1", value: "1" },
                            { label: "Option 2", value: "2" },
                        ]}
                    />
                )}
            </Form>,
        );

        const selectField = screen.getByTestId("test-select-input");
        expect(selectField).toBeInTheDocument();
        expect(selectField.tagName).toBe("INPUT");
    });

    it("should render data-testid on the component when setting it in the componentsProps", () => {
        render(
            <Form onSubmit={jest.fn()}>
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
