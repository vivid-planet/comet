import { Check, Reset } from "@comet/admin-icons";
import { Button, ButtonProps, ComponentsOverrides, Popover, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { Form, useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { dirtyFieldsCount } from "../dirtyFieldsCount";
import { FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";
import { FilterBarButton, FilterBarButtonProps } from "../filterBarButton/FilterBarButton";
import { FilterBarPopoverFilterClassKey, styles } from "./FilterBarPopoverFilter.styles";

export interface FilterBarPopoverFilterProps {
    label: string;
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    calcNumberDirtyFields?: (values: Record<string, any>, registeredFields: string[]) => number;
    submitButtonProps?: ButtonProps;
    resetButtonProps?: ButtonProps;
    filterBarButtonProps?: FilterBarButtonProps;
}

function PopoverFilter({
    children,
    label,
    dirtyFieldsBadge,
    calcNumberDirtyFields = dirtyFieldsCount,
    submitButtonProps,
    resetButtonProps,
    filterBarButtonProps,
    classes,
}: React.PropsWithChildren<FilterBarPopoverFilterProps> & WithStyles<typeof styles>) {
    const outerForm = useForm();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

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
                        <div className={classes.fieldBarWrapper}>
                            <FilterBarButton
                                openPopover={open}
                                numberDirtyFields={countValue}
                                onClick={handleClick}
                                dirtyFieldsBadge={dirtyFieldsBadge}
                                {...filterBarButtonProps}
                            >
                                {label}
                            </FilterBarButton>
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

export const FilterBarPopoverFilter = withStyles(styles, { name: "CometAdminFilterBarPopoverFilter" })(PopoverFilter);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarPopoverFilter: FilterBarPopoverFilterClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarPopoverFilter: FilterBarPopoverFilterProps;
    }

    interface Components {
        CometAdminFilterBarPopoverFilter?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarPopoverFilter"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarPopoverFilter"];
        };
    }
}
