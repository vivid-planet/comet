import { InputAdornment, TextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { useStyles, useThemeProps } from "./FinalFormSearchTextField.styles";

export const FinalFormSearchTextField: React.FunctionComponent<TextFieldProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>> = ({
    icon,
    input: { name, onChange, value, ...restInput },
    placeholder,
    variant = "outlined",
    ...restProps
}) => {
    const intl = useIntl();
    const themeProps = useThemeProps();
    const classes = useStyles({});

    return (
        <TextField
            {...restProps}
            name={name}
            variant={variant}
            onChange={onChange}
            value={value}
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.finalformsearchtextfield.default.placeholder", defaultMessage: "Search" })}
            InputProps={{
                ...restInput,
                startAdornment: (
                    <InputAdornment position="start">
                        <div className={classes.iconContainer}>{icon ?? themeProps.icon}</div>
                    </InputAdornment>
                ),
            }}
        />
    );
};
