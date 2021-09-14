import { Check, ChevronDown, Reset } from "@comet/admin-icons";
import { Button, Popover, Typography } from "@material-ui/core";
import { ThemeOptions, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import * as React from "react";
import { Form, useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { dirtyFieldsCount } from "../dirtyFieldsCount";
import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";
import { useStyles } from "./FilterBarPopoverFilter.styles";

export interface FilterBarPopoverFilterProps {
    label: string;
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    calcNumberDirtyFields?: (values: Record<string, any>, registeredFields: string[]) => number;
}

export function FilterBarPopoverFilter({
    children,
    label,
    dirtyFieldsBadge,
    calcNumberDirtyFields = dirtyFieldsCount,
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
                {({ form, values, handleSubmit, dirtyFields }) => {
                    const countValue = calcNumberDirtyFields(values, form.getRegisteredFields());
                    return (
                        <div className={clsx(classes.fieldBarWrapper, countValue > 0 && classes.fieldBarWrapperWithValues)}>
                            <div className={classes.fieldBarInnerWrapper} onClick={handleClick}>
                                <div className={clsx(classes.labelWrapper, countValue > 0 && classes.labelWrapperWithValues)}>
                                    <Typography variant="body1">{label}</Typography>
                                </div>
                                <FilterBarActiveFilterBadgeComponent countValue={countValue} />
                                <ChevronDown />
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
                                PaperProps={{ square: true, elevation: 1 }}
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
                                            startIcon={<Reset />}
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
                                            startIcon={<Check />}
                                            disabled={Object.values(dirtyFields).length === 0}
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
