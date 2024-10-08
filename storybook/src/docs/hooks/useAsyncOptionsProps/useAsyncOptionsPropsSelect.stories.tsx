import { Field, FinalFormSelect, useAsyncOptionsProps } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/hooks/useAsyncOptionsPropsSelect", module).add("Select", () => {
    interface Option {
        value: string;
        label: string;
    }
    const initialValues = React.useMemo(() => {
        return { selectAsync: { value: "strawberry", label: "Strawberry" } };
    }, []);

    const selectAsyncProps = useAsyncOptionsProps<Option>(async () => {
        return new Promise((resolve) =>
            setTimeout(() => {
                return resolve([
                    { value: "chocolate", label: "Chocolate" },
                    { value: "strawberry", label: "Strawberry" },
                    { value: "vanilla", label: "Vanilla" },
                ]);
            }, 500),
        );
    });

    return (
        <div style={{ minHeight: "50px" }}>
            <Form onSubmit={() => {}} initialValues={initialValues}>
                {() => (
                    <Field
                        name="selectAsync"
                        component={FinalFormSelect}
                        {...selectAsyncProps}
                        getOptionLabel={(option: Option) => option.label}
                        getOptionSelected={(option: Option, value: Option) => {
                            return option.value === value.value;
                        }}
                        style={{ width: "300px" }}
                    />
                )}
            </Form>
        </div>
    );
});
