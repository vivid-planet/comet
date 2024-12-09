import { Field, FinalFormAutocomplete, FinalFormSelect, useAsyncOptionsProps } from "@comet/admin";
import { useMemo } from "react";
import { Form } from "react-final-form";

export default {
    title: "Docs/Hooks/useAsyncOptionsProps",
};

export const Select = () => {
    interface Option {
        value: string;
        label: string;
    }
    const initialValues = useMemo(() => {
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
};

export const Autocomplete = () => {
    interface Option {
        value: string;
        label: string;
    }

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
            <Form onSubmit={() => {}} initialValues={{ autocompleteAsync: { value: "strawberry", label: "Strawberry" } }}>
                {() => (
                    <Field
                        name="autocompleteAsync"
                        component={FinalFormAutocomplete}
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
};
