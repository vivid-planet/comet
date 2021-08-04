import { Button, ButtonProps, Popover, Typography } from "@material-ui/core";
import { makeStyles, Theme, ThemeOptions, useTheme } from "@material-ui/core/styles";
import * as React from "react";
import { Form, useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "./FilterBarActiveFilterBadge";

export interface FilterBarPopoverFilterThemeProps {
    submitButton?: ButtonProps;
    resetButton?: ButtonProps;
}

export type CometAdminFilterBarPopoverFilterClassKeys =
    | "root"
    | "fieldBarWrapper"
    | "fieldBarInnerWrapper"
    | "labelWrapper"
    | "popoverContentContainer"
    | "popoverInnerContentContainer"
    | "paper"
    | "buttonsContainer";

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            minWidth: "150px",
            border: `1px solid ${theme.palette.grey[300]}`,
            position: "relative",
            marginBottom: "10px",
            marginRight: "10px",
        },
        fieldBarWrapper: {
            position: "relative",
        },
        fieldBarInnerWrapper: {
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
            minWidth: 300,
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
        paper: {
            border: "1px solid grey",
            marginLeft: -1, //due to border of popover, but now overrideable with styling if needed
        },
    }),
    { name: "CometAdminFilterBarPopoverFilter" },
);

export interface FilterBarPopoverFilterProps {
    label: string;
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    calcNumberDirtyFields?: (values: Record<string, any>, registeredFields: string[]) => number;
}

export function FilterBarPopoverFilter({
    children,
    label,
    dirtyFieldsBadge,
    calcNumberDirtyFields,
}: React.PropsWithChildren<FilterBarPopoverFilterProps>) {
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;
    const outerForm = useForm();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const { props: themeProps } = useTheme<ThemeOptions>();
    const submitButtonProps =
        themeProps && themeProps["CometAdminFilterBarPopoverFilter"] ? { ...themeProps["CometAdminFilterBarPopoverFilter"]?.submitButton } : {};
    const resetButtonProps =
        themeProps && themeProps["CometAdminFilterBarPopoverFilter"] ? { ...themeProps["CometAdminFilterBarPopoverFilter"]?.resetButton } : {};

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Form
                onSubmit={(values) => {
                    for (const name in values) {
                        outerForm.change(name, values[name]);
                    }
                }}
                initialValues={outerForm.getState().values}
            >
                {({ form, values, handleSubmit }) => {
                    return (
                        <div className={classes.fieldBarWrapper}>
                            <div className={classes.fieldBarInnerWrapper} onClick={handleClick}>
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
                                keepMounted
                            >
                                <div className={classes.popoverContentContainer}>
                                    {children}
                                    <div className={classes.buttonsContainer}>
                                        <Button
                                            type="reset"
                                            variant="text"
                                            onClick={() => {
                                                form.getRegisteredFields().map((name) => {
                                                    outerForm.change(name, undefined);
                                                });
                                                form.reset();

                                                setAnchorEl(null);
                                            }}
                                            {...resetButtonProps}
                                        >
                                            <FormattedMessage id="cometAdmin.generic.resetButton" defaultMessage="Reset" />
                                        </Button>

                                        <Button
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                            onClick={() => {
                                                handleSubmit();
                                                setAnchorEl(null);
                                            }}
                                            {...submitButtonProps}
                                        >
                                            <FormattedMessage id="cometAdmin.generic.applyButton" defaultMessage="Apply" />
                                        </Button>
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
