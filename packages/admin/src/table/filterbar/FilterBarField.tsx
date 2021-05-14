import { Button, ButtonProps, Popover, Typography } from "@material-ui/core";
import { makeStyles, Theme, ThemeOptions, useTheme } from "@material-ui/core/styles";
import * as React from "react";
import { Form, useForm } from "react-final-form";
import { useIntl } from "react-intl";

import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "./FilterBarActiveFilterBadge";

export interface FieldThemeProps {
    submitButton?: ButtonProps;
    resetButton?: ButtonProps;
}

export type CometAdminFilterBarFieldClassKeys =
    | "root"
    | "styledBox"
    | "labelWrapper"
    | "popoverContentContainer"
    | "popoverInnerContentContainer"
    | "paper"
    | "buttonsContainer"
    | "submitContainer"
    | "resetCloseContainer";

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            position: "relative",
        },
        fieldBarWrapper: {
            minWidth: "150px",
            border: `1px solid ${theme.palette.grey[300]}`,
            position: "relative",
            marginBottom: "10px",
            marginRight: "10px",
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
        popoverContentContainer: {
            "& [class*='CometAdminFormFieldContainer-root']": {
                boxSizing: "border-box",
                padding: "20px",
                marginBottom: 0,
            },
        },
        popoverInnerContentContainer: {
            minWidth: 300,
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
        paper: {
            border: "1px solid grey",
            marginLeft: -1, //due to border of popover, but now overrideable with styling if needed
        },
    }),
    { name: "CometAdminFilterBarField" },
);

export interface FilterBarFieldProps {
    label: string;
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    calcNumberDirtyFields?: (values: Record<string, any>) => number;
}

export function FilterBarField({ children, label, dirtyFieldsBadge, calcNumberDirtyFields }: React.PropsWithChildren<FilterBarFieldProps>) {
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;
    const outerForm = useForm();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const { props: themeProps } = useTheme<ThemeOptions>();
    const submitButtonProps = themeProps && themeProps["CometAdminFilterBarField"] ? { ...themeProps["CometAdminFilterBarField"]?.submitButton } : {};
    const resetButtonProps = themeProps && themeProps["CometAdminFilterBarField"] ? { ...themeProps["CometAdminFilterBarField"]?.resetButton } : {};

    const classes = useStyles();
    const intl = useIntl();

    return (
        <div className={classes.fieldBarWrapper}>
            <Form
                onSubmit={(values) => {
                    for (const name in values) {
                        outerForm.change(name, values[name]);
                    }
                }}
                initialValues={outerForm.getState().initialValues}
            >
                {({ form, values, handleSubmit, initialValues }) => {
                    return (
                        <div className={classes.root}>
                            <div className={classes.styledBox} onClick={handleClick}>
                                <div className={classes.labelWrapper}>
                                    <Typography variant="subtitle2">{label}</Typography>
                                </div>
                                <FilterBarActiveFilterBadgeComponent values={values} calcNumberDirtyFields={calcNumberDirtyFields} />
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
                                PaperProps={{ square: true }}
                                classes={{
                                    paper: classes.paper,
                                }}
                                elevation={2}
                            >
                                <div className={classes.popoverContentContainer}>
                                    <div className={classes.popoverInnerContentContainer}>
                                        {children}
                                        <div className={classes.buttonsContainer}>
                                            <div className={classes.resetContainer}>
                                                <Button
                                                    type="reset"
                                                    variant="text"
                                                    onClick={() => {
                                                        for (const name in values) {
                                                            //required because reset removes values
                                                            outerForm.change(name, initialValues[name]);
                                                        }
                                                        form.reset();

                                                        setAnchorEl(null);
                                                    }}
                                                    {...resetButtonProps}
                                                >
                                                    <Typography variant={"button"}>
                                                        {intl.formatMessage({
                                                            id: "cometAdmin.generic.resetButton",
                                                            defaultMessage: "Reset",
                                                        })}
                                                    </Typography>
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
                                                    <Typography variant={"button"}>
                                                        {intl.formatMessage({
                                                            id: "cometAdmin.generic.applyButton",
                                                            defaultMessage: "Apply",
                                                        })}
                                                    </Typography>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popover>
                        </div>
                    );
                }}
            </Form>
        </div>
    );
}
