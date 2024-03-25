import { Field, FinalFormSelect } from "@comet/admin";
import { Account } from "@comet/admin-icons";
import { Card, CardContent, InputAdornment, MenuItem } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    interface Option {
        value: string;
        label: string;
    }

    const options: Option[] = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "raspberry", label: "Raspberry" },
        { value: "vanilla", label: "Vanilla" },
        { value: "mango", label: "Mango" },
    ];

    return (
        <div style={{ maxWidth: "800px" }}>
            <p>
                If an options-prop or the props from the useAsyncOptionsProps-Hook are passed, FinalFormSelect automatically renders the options by
                itself and uses objects as values.
            </p>
            <div style={{ width: 350 }}>
                <Form
                    initialValues={{
                        multipleFlavours: [],
                        multipleFlavoursClearable: [],
                    }}
                    onSubmit={() => {
                        //
                    }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Field name="flavor" label="Flavor" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} fullWidth>
                                                {options.map((option: Option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="flavorOptions" label="Flavor with Options as prop" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect
                                                {...props}
                                                options={options}
                                                getOptionLabel={(option: Option) => option.label}
                                                getOptionSelected={(option: Option, value: Option) => option.value === value.value}
                                                fullWidth
                                            />
                                        )}
                                    </Field>

                                    <Field name="flavorClearable" label="Clearable Flavor" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} fullWidth clearable>
                                                {options.map((option: Option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="flavorRequired" label="Required Flavor" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} fullWidth required>
                                                {options.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="flavorDisabled" label="Disabled Flavor" fullWidth disabled>
                                        {(props) => (
                                            <FinalFormSelect {...props} fullWidth>
                                                {options.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="flavorMultipleAdornments" label="Flavor with adornments" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect
                                                {...props}
                                                fullWidth
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <Account />
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end" disablePointerEvents sx={{ width: 24 }}>
                                                        <Account />
                                                    </InputAdornment>
                                                }
                                            >
                                                {options.map((option: Option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="multipleFlavours" label="Multiple Flavours" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} multiple>
                                                {options.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>

                                    <Field name="multipleFlavoursClearable" label="Multiple Flavours Clearable" fullWidth>
                                        {(props) => (
                                            <FinalFormSelect {...props} multiple clearable>
                                                {options.map((option) => (
                                                    <MenuItem value={option.value} key={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </FinalFormSelect>
                                        )}
                                    </Field>
                                </CardContent>
                            </Card>
                        </form>
                    )}
                />
            </div>
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Select", () => <Story />);
