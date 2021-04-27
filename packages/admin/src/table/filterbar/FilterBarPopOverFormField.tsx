import { Box, Button, ButtonProps, Popover, Typography } from "@material-ui/core";
import { makeStyles, Theme, ThemeOptions, useTheme } from "@material-ui/core/styles";
import isEqual = require("lodash.isequal");
import get = require("lodash.get");
import { FieldState } from "final-form";
import * as React from "react";
import { FieldRenderProps, Form, useForm } from "react-final-form";

import { difference } from "./difference";
import { IFilterBarField } from "./FilterBar";

export interface PopoverFormFieldThemeProps {
    submitButton?: ButtonProps;
    resetButton?: ButtonProps;
}

export type CometAdminFilterBarPopOverFormFieldClassKeys =
    | "root"
    | "styledBox"
    | "labelWrapper"
    | "hasValueCount"
    | "popoverContentContainer"
    | "buttonsContainer"
    | "submitContainer"
    | "resetCloseContainer";

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            position: "relative",
        },
        styledBox: {
            position: "relative",
            alignItems: "center",
            padding: "10px 20px",
            cursor: "pointer",
            display: "flex",

            "&:after": {
                borderTop: `4px solid ${theme.palette.grey[300]}`,
                borderRight: "4px solid transparent",
                borderLeft: "4px solid transparent",
                position: "absolute",
                display: "block",
                right: "10px",
                content: "''",
                top: "50%",
                height: 0,
                width: 0,
            },
        },
        labelWrapper: {
            marginRight: "15px",
            boxSizing: "border-box",
        },
        hasValueCount: {
            backgroundColor: `${theme.palette.grey[100]}`,
            textAlign: "center",
            borderRadius: "4px",
            height: "20px",
            width: "17px",
        },
        popoverContentContainer: {
            "& [class*='CometAdminFormFieldContainer-root']": {
                boxSizing: "border-box",
                padding: "20px",
                marginBottom: 0,
            },
        },
        buttonsContainer: {
            borderTop: `1px solid ${theme.palette.grey[300]}`,
            justifyContent: "space-between",
            padding: "10px 15px",
            display: "flex",
        },
        submitContainer: {},
        resetContainer: {
            marginRight: "15px",
        },
    }),
    { name: "CometAdminFilterBarPopOverFormField" },
);

interface IFormFieldProps extends FieldRenderProps<any> {
    field: IFilterBarField;
    handleSubmit: () => void;
}

export const isEqualFunction = (nextValue?: any, preValue?: any) => {
    if (preValue === nextValue) {
        return true;
    } else {
        return isEqual(nextValue, preValue);
    }
};

export const dirtyFieldsCount = (fieldState?: FieldState<any>) => {
    if (fieldState?.initial) {
        const diff = difference<any, Record<string, any>>(fieldState?.value, fieldState?.initial);
        return Object.keys(diff).length;
    }
    return Object.keys(fieldState?.value).length;
};

export const FilterBarPopOverFormField: React.FunctionComponent<IFormFieldProps & PopoverFormFieldThemeProps> = ({ field }) => {
    const outerForm = useForm();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const { values } = outerForm.getState();
    const { props: themeProps } = useTheme<ThemeOptions>();
    const submitButtonProps =
        themeProps && themeProps["CometAdminFilterBarPopOverFormField"] ? { ...themeProps["CometAdminFilterBarPopOverFormField"]?.submitButton } : {};
    const resetButtonProps =
        themeProps && themeProps["CometAdminFilterBarPopOverFormField"] ? { ...themeProps["CometAdminFilterBarPopOverFormField"]?.resetButton } : {};

    const classes = useStyles({ open: open });

    return (
        <Form
            onSubmit={(values) => {
                const formFieldValues = get(values, field.name);
                outerForm.change(field.name, formFieldValues);
            }}
            initialValues={values}
        >
            {({ form, handleSubmit }) => {
                return (
                    <div className={classes.root}>
                        <div className={classes.styledBox} onClick={handleClick}>
                            <div className={classes.labelWrapper}>
                                <Typography variant="subtitle2">{field.label}</Typography>
                            </div>
                            {!isEqualFunction(outerForm.getFieldState(field.name)?.value, outerForm.getFieldState(field.name)?.initial) && (
                                <div className={classes.hasValueCount}>
                                    <Typography variant={"subtitle2"}>
                                        {Array.isArray(outerForm.getFieldState(field.name)?.value)
                                            ? outerForm.getFieldState(field.name)?.value.length
                                            : typeof outerForm.getFieldState(field.name)?.value === "object"
                                            ? dirtyFieldsCount(outerForm.getFieldState(field.name))
                                            : 1}
                                    </Typography>
                                </div>
                            )}
                        </div>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={() => {
                                setAnchorEl(null);
                                handleSubmit();
                            }}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: -1,
                                horizontal: 0,
                            }}
                            PaperProps={{ square: true }}
                            classes={{
                                paper: "paper",
                            }}
                            elevation={2}
                        >
                            <div className={classes.popoverContentContainer}>
                                <Box style={{ minWidth: 300 }}>
                                    {React.createElement(field.component)}
                                    <div className={classes.buttonsContainer}>
                                        <div className={classes.resetContainer}>
                                            <Button
                                                type="reset"
                                                variant="text"
                                                onClick={() => {
                                                    const hasInitialValue = !!outerForm.getFieldState(field.name)?.initial;

                                                    outerForm.change(
                                                        field.name,
                                                        hasInitialValue ? outerForm.getFieldState(field.name)?.initial : undefined,
                                                    );
                                                    form.change(
                                                        field.name,
                                                        hasInitialValue ? outerForm.getFieldState(field.name)?.initial : undefined,
                                                    );
                                                    setAnchorEl(null);
                                                }}
                                                {...resetButtonProps}
                                            >
                                                <Typography variant={"button"}>{"Zurücksetzen"}</Typography>
                                            </Button>
                                        </div>
                                        <div className={classes.submitContainer}>
                                            <Button
                                                fullWidth={true}
                                                type="submit"
                                                color="primary"
                                                variant="contained"
                                                onClick={() => {
                                                    handleSubmit();
                                                    setAnchorEl(null);
                                                }}
                                                {...submitButtonProps}
                                            >
                                                <Typography variant={"button"}>{"Übernehmen"}</Typography>
                                            </Button>
                                        </div>
                                    </div>
                                </Box>
                            </div>
                        </Popover>
                    </div>
                );
            }}
        </Form>
    );
};
