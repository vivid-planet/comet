import { ClearInputAdornment, Field, FieldContainer, FinalFormInput, FinalFormSelect } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { Cut } from "@comet/admin-icons";
import { Grid, InputBase, MenuItem } from "@mui/material";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "Docs/Components/Clear Input Adornment",
};

export const Basic = {
    render: () => {
        const [inputText, setInputText] = useState<string>("Lorem ipsum");

        return (
            <Grid container spacing={4}>
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <FieldContainer label="Using ClearInputAdornment in an input" fullWidth>
                        <InputBase
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            endAdornment={
                                <ClearInputAdornment position="end" hasClearableContent={Boolean(inputText)} onClick={() => setInputText("")} />
                            }
                        />
                    </FieldContainer>
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <FieldContainer label="Custom icon" fullWidth>
                        <InputBase
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            endAdornment={
                                <ClearInputAdornment
                                    position="end"
                                    hasClearableContent={Boolean(inputText)}
                                    onClick={() => setInputText("")}
                                    icon={<Cut />}
                                />
                            }
                        />
                    </FieldContainer>
                </Grid>
            </Grid>
        );
    },
};

export const ClearableProp = {
    render: () => {
        const selectOptions = [
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" },
        ];

        return (
            <Form
                onSubmit={() => {}}
                initialValues={{
                    text: "Lorem ipsum",
                    select: selectOptions[0].value,
                    date: new Date(),
                }}
            >
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 4,
                                }}
                            >
                                <Field component={FinalFormInput} clearable fullWidth name="text" label="FinalFormInput" />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 4,
                                }}
                            >
                                <Field name="select" label="FinalFormSelect" fullWidth>
                                    {(props) => (
                                        <FinalFormSelect {...props} clearable>
                                            {selectOptions.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </FinalFormSelect>
                                    )}
                                </Field>
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 4,
                                }}
                            >
                                <Field component={FinalFormDatePicker} clearable fullWidth name="date" label="FinalFormDatePicker" />
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Form>
        );
    },
    name: "Clearable prop",
};
