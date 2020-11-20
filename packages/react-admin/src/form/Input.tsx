import { Theme } from "@material-ui/core";
import MuiInputBase, { InputBaseProps } from "@material-ui/core/InputBase";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export type VPAdminInputClassKeys = "input";

export const getDefaultVPAdminInputStyles = (theme: Theme) => {
    return {
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: "2px",
        padding: "0 10px",
        height: "32px",
    };
};

const styles = (theme: Theme) =>
    createStyles({
        input: getDefaultVPAdminInputStyles(theme),
    });

const InputBase: React.FunctionComponent<InputBaseProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>> = ({
    meta,
    input,
    innerRef,
    ...props
}) => {
    return <MuiInputBase {...input} {...props} />;
};

export const Input = withStyles(styles, { name: "VPAdminInputBase", withTheme: true })(InputBase);
