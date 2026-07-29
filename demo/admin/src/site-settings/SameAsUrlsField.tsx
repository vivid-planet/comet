import { Button, DeleteButton, FieldContainer, messages, TextField } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Stack } from "@mui/material";
import type { ReactNode } from "react";
import { FieldArray } from "react-final-form-arrays";
import { FormattedMessage } from "react-intl";

import { validateUrl } from "./validateUrl";

type SameAsUrlsFieldProps = {
    name: string;
    label?: ReactNode;
    helperText?: ReactNode;
};

export function SameAsUrlsField({ name, label, helperText }: SameAsUrlsFieldProps) {
    return (
        <FieldContainer label={label} helperText={helperText} fullWidth>
            <FieldArray<string> name={name}>
                {({ fields }) => (
                    <Stack spacing={2} alignItems="flex-start">
                        {fields.map((fieldName, index) => (
                            <Stack key={fieldName} direction="row" spacing={2} alignItems="flex-start" width="100%">
                                <TextField
                                    fullWidth
                                    name={fieldName}
                                    validate={validateUrl}
                                    fieldContainerProps={{ fieldMargin: "never" }}
                                    placeholder="https://example.com"
                                />
                                <DeleteButton onClick={() => fields.remove(index)} />
                            </Stack>
                        ))}
                        <Button variant="outlined" startIcon={<Add />} onClick={() => fields.push("")}>
                            <FormattedMessage {...messages.add} />
                        </Button>
                    </Stack>
                )}
            </FieldArray>
        </FieldContainer>
    );
}
