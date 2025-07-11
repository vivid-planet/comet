import { ClearInputAdornment, Field, FieldContainer } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { Calendar } from "@comet/admin-icons";
import { Grid, InputBase } from "@mui/material";
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers";
import { useState } from "react";
import { Form } from "react-final-form";

export default {
    title: "Docs/Form/Components/Date & Time Pickers/Date Picker",
};

/**
 * TODO
 * - Add clear button
 * - Do we need to handle `formatDateOptions` prop?
 * - Implement and use Final-Form variant (`DateField`)
 */

type SimplifiedDatePickerProps = DatePickerProps & {
    fullWidth?: boolean;
    required?: boolean;
};

const SimplifiedDatePicker = ({ fullWidth, required, slotProps, disabled, value, onChange, ...restProps }: SimplifiedDatePickerProps) => {
    return (
        <DatePicker
            {...restProps}
            disabled={disabled}
            value={value}
            onChange={onChange}
            slots={{
                openPickerIcon: Calendar,
            }}
            slotProps={{
                ...slotProps,
                field: {
                    openPickerButtonPosition: "start",
                    ...slotProps?.field,
                },
                textField: {
                    fullWidth,
                    // variant: "outlined",
                    required,
                    ...slotProps?.textField,
                    InputProps: {
                        endAdornment:
                            !required && !disabled ? (
                                <>
                                    <ClearInputAdornment
                                        position="end"
                                        hasClearableContent={Boolean(value)}
                                        onClick={() => onChange && onChange(undefined)}
                                    />
                                    {slotProps?.textField?.InputProps?.endAdornment}
                                </>
                            ) : (
                                slotProps?.textField?.InputProps?.endAdornment
                            ),
                        ...slotProps?.textField?.InputProps,
                    },
                },
            }}
        />
    );
};

export const Basic = () => {
    const [dateOne, setDateOne] = useState<Date | null>(null);
    const [dateTwo, setDateTwo] = useState<Date | null>(new Date("2024-03-10"));

    return (
        <Grid container spacing={4}>
            <Grid size={{ xs: 4 }}>
                <FieldContainer label="Date Picker" fullWidth>
                    <SimplifiedDatePicker value={dateOne} onChange={setDateOne} fullWidth />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 4 }}>
                <FieldContainer label="Required" fullWidth required>
                    <SimplifiedDatePicker value={dateTwo} onChange={setDateTwo} fullWidth required />
                </FieldContainer>
            </Grid>
            <Grid size={{ xs: 4 }}>
                <FieldContainer label="Required" fullWidth required>
                    {/* TODO: Remove this after styling of DatePicker matches this */}
                    <InputBase value="Hello" onChange={() => {}} fullWidth required />
                </FieldContainer>
            </Grid>
        </Grid>
    );
};

export const FinalForm = () => {
    type Values = {
        dateOne: string;
        dateTwo: string;
        dateThree: string;
        dateFour: string;
    };

    return (
        <Form<Values> initialValues={{ dateThree: "2024-03-10", dateFour: "2024-03-10" }} onSubmit={() => {}}>
            {() => (
                <Grid container spacing={4}>
                    <Grid
                        size={{
                            xs: 6,
                            md: 3,
                        }}
                    >
                        <Field name="dateOne" label="Date Picker" fullWidth component={FinalFormDatePicker} />
                    </Grid>
                    <Grid
                        size={{
                            xs: 6,
                            md: 3,
                        }}
                    >
                        <Field name="dateTwo" label="Show two months" fullWidth component={FinalFormDatePicker} monthsToShow={2} />
                    </Grid>
                    <Grid
                        size={{
                            xs: 6,
                            md: 3,
                        }}
                    >
                        <Field name="dateThree" label="Required" fullWidth component={FinalFormDatePicker} required />
                    </Grid>
                    <Grid
                        size={{
                            xs: 6,
                            md: 3,
                        }}
                    >
                        <Field
                            name="dateFour"
                            label="Formatted date"
                            fullWidth
                            component={FinalFormDatePicker}
                            formatDateOptions={{ month: "long", day: "numeric", year: "numeric" }}
                        />
                    </Grid>
                </Grid>
            )}
        </Form>
    );
};
