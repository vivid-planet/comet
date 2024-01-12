import { Check, Reset } from "@comet/admin-icons";
import { Button, ButtonProps, ComponentsOverrides, Popover, Theme } from "@mui/material";
import { css, styled, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";
import { Form, useForm } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";
import { dirtyFieldsCount } from "../dirtyFieldsCount";
import { FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";
import { FilterBarButton, FilterBarButtonProps } from "../filterBarButton/FilterBarButton";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */

export type FilterBarPopoverFilterClassKey =
    | "root"
    | "fieldBarWrapper"
    | "popoverContentContainer"
    | "paper"
    | "buttonsContainer"
    | "contentContainer";

const Root = styled("div", {
    name: "CometAdminFilterBarPopoverFilter",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    ({ theme }) => css`
        background-color: ${theme.palette.common.white};
        position: relative;
        margin-bottom: 10px;
        border-radius: 2px;
        margin-right: 6px;
    `,
);

const FieldBarWrapper = styled("div", {
    name: "CometAdminFilterBarPopoverFilter",
    slot: "fieldBarWrapper",
    overridesResolver(_, styles) {
        return [styles.fieldBarWrapper];
    },
})(
    css`
        position: relative;
    `,
);

const PopoverContentContainer = styled("div", {
    name: "CometAdminFilterBarPopoverFilter",
    slot: "popoverContentContainer",
    overridesResolver(_, styles) {
        return [styles.popoverContentContainer];
    },
})(
    css`
        min-width: 300px;
    `,
);

const StyledPopover = styled(Popover, {
    name: "CometAdminFilterBarPopoverFilter",
    slot: "paper",
    overridesResolver(_, styles) {
        return [styles.tabs];
    },
})(css`
    margin-left: -1px;
    margin-top: 2px;
`);

const ContentContainer = styled("div", {
    name: "CometAdminFilterBarPopoverFilter",
    slot: "contentContainer",
    overridesResolver(_, styles) {
        return [styles.contentContainer];
    },
})(
    css`
        box-sizing: border-box;
        padding: 20px;
        margin-bottom: 0;
    `,
);

const ButtonsContainer = styled("div", {
    name: "CometAdminFilterBarPopoverFilter",
    slot: "buttonsContainer",
    overridesResolver(_, styles) {
        return [styles.buttonsContainer];
    },
})(
    ({ theme }) => css`
        border-top: 1px solid ${theme.palette.grey[100]};
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px 15px;
        display: flex;
        height: 60px;
    `,
);

export interface FilterBarPopoverFilterProps
    extends ThemedComponentBaseProps<{
        root: "div";
        fieldBarWrapper: "div";
        popoverContentContainer: "div";
        paper: typeof Popover;
        buttonsContainer: "div";
        contentContainer: "div";
    }> {
    label: string;
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    calcNumberDirtyFields?: (values: Record<string, any>, registeredFields: string[]) => number;
    submitButtonProps?: Partial<ButtonProps>;
    resetButtonProps?: Partial<ButtonProps>;
    filterBarButtonProps?: Partial<FilterBarButtonProps>;
    children: any;
}

export function FilterBarPopoverFilter(inProps: FilterBarPopoverFilterProps) {
    const {
        children,
        label,
        dirtyFieldsBadge,
        calcNumberDirtyFields = dirtyFieldsCount,
        submitButtonProps,
        resetButtonProps,
        filterBarButtonProps,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFilterBarPopoverFilter" });

    const outerForm = useForm();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <Root {...slotProps?.root} {...restProps}>
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
                        <FieldBarWrapper {...slotProps?.fieldBarWrapper}>
                            <FilterBarButton
                                openPopover={open}
                                numberDirtyFields={countValue}
                                onClick={handleClick}
                                dirtyFieldsBadge={dirtyFieldsBadge}
                                {...filterBarButtonProps}
                            >
                                {label}
                            </FilterBarButton>
                            <StyledPopover
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
                                elevation={2}
                                keepMounted
                            >
                                <PopoverContentContainer {...slotProps?.popoverContentContainer}>
                                    <ContentContainer {...slotProps?.contentContainer}>{children}</ContentContainer>
                                    <ButtonsContainer {...slotProps?.buttonsContainer}>
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
                                            <FormattedMessage {...messages.reset} />
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
                                            <FormattedMessage {...messages.apply} />
                                        </Button>
                                    </ButtonsContainer>
                                </PopoverContentContainer>
                            </StyledPopover>
                        </FieldBarWrapper>
                    );
                }}
            </Form>
        </Root>
    );
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarPopoverFilter: FilterBarPopoverFilterClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarPopoverFilter: Partial<FilterBarPopoverFilterProps>;
    }

    interface Components {
        CometAdminFilterBarPopoverFilter?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarPopoverFilter"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarPopoverFilter"];
        };
    }
}
