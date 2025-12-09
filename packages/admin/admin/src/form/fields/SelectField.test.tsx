import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";

import { SelectField } from "./SelectField";

describe("SelectField", () => {
    it("should render data-testid on the component when setting it in the root prop dataTestId", () => {
        render(
            <Form onSubmit={jest.fn()}>
                {() => (
                    <SelectField
                        name="test"
                        dataTestid="test-select"
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
    });
});
