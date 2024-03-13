import { createComponentSlot, ThemedComponentBaseProps } from "@comet/admin";
import { ArrowLeft, ArrowRight, ChevronDown } from "@comet/admin-icons";
import { Box, Button, buttonClasses, ComponentsOverrides, IconButton, Menu, menuClasses, MenuItem } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { useIntl } from "react-intl";

export interface DatePickerNavigationProps
    extends ThemedComponentBaseProps<{
        root: "div";
        selectMonthButton: typeof Button;
        selectYearButton: typeof Button;
        selectMonthMenu: typeof Menu;
        selectYearMenu: typeof Menu;
    }> {
    focusedDate: Date;
    changeShownDate: (value: number, mode: "setYear" | "setMonth" | "monthOffset") => void;
    minDate: Date;
    maxDate: Date;
}

export const DatePickerNavigation = (inProps: DatePickerNavigationProps) => {
    const { focusedDate, changeShownDate, minDate, maxDate, slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminDatePickerNavigation",
    });
    const intl = useIntl();

    const [showMonthSelect, setShowMonthSelect] = React.useState<boolean>(false);
    const [showYearSelect, setShowYearSelect] = React.useState<boolean>(false);

    const monthSelectRef = React.useRef<HTMLButtonElement>(null);
    const yearSelectRef = React.useRef<HTMLButtonElement>(null);

    return (
        <Root {...slotProps?.root} {...restProps}>
            <IconButton onClick={() => changeShownDate(-1, "monthOffset")}>
                <ArrowLeft />
            </IconButton>
            <Box>
                <SelectMonthButton
                    size="small"
                    onClick={() => setShowMonthSelect(true)}
                    ref={monthSelectRef}
                    endIcon={<ChevronDown />}
                    {...slotProps?.selectMonthButton}
                >
                    {intl.formatDate(focusedDate, { month: "long" })}
                </SelectMonthButton>
                <SelectMonthMenu
                    open={showMonthSelect}
                    onClose={() => setShowMonthSelect(false)}
                    anchorEl={monthSelectRef.current}
                    {...slotProps?.selectMonthMenu}
                >
                    {new Array(12).fill(null).map((_, month: number) => (
                        <MenuItem
                            selected={month === focusedDate.getMonth()}
                            key={month}
                            value={month}
                            onClick={() => {
                                setShowMonthSelect(false);
                                changeShownDate(month, "setMonth");
                            }}
                        >
                            {intl.formatDate(new Date(focusedDate.getFullYear(), month), { month: "long" })}
                        </MenuItem>
                    ))}
                </SelectMonthMenu>
                <SelectYearButton
                    size="small"
                    ref={yearSelectRef}
                    onClick={() => setShowYearSelect(true)}
                    endIcon={<ChevronDown />}
                    {...slotProps?.selectYearButton}
                >
                    {focusedDate.getFullYear()}
                </SelectYearButton>
                <SelectYearMenu
                    open={showYearSelect}
                    onClose={() => setShowYearSelect(false)}
                    anchorEl={yearSelectRef.current}
                    {...slotProps?.selectYearMenu}
                >
                    {new Array(maxDate.getFullYear() - minDate.getFullYear() + 1).fill(maxDate.getFullYear()).map((val, i) => {
                        const year = val - i;
                        return (
                            <MenuItem
                                selected={year === focusedDate.getFullYear()}
                                key={year}
                                value={year}
                                onClick={() => {
                                    setShowYearSelect(false);
                                    changeShownDate(year, "setYear");
                                }}
                            >
                                {year}
                            </MenuItem>
                        );
                    })}
                </SelectYearMenu>
            </Box>
            <IconButton onClick={() => changeShownDate(+1, "monthOffset")}>
                <ArrowRight />
            </IconButton>
        </Root>
    );
};

export type DatePickerNavigationClassKey =
    | "root"
    | "selectButton"
    | "selectMonthButton"
    | "selectYearButton"
    | "selectMenu"
    | "selectMonthMenu"
    | "selectYearMenu";

const Root = createComponentSlot("div")<DatePickerNavigationClassKey>({
    componentName: "DatePickerNavigation",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.palette.grey[50]};
        height: 50px;
    `,
);

const SelectMonthButton = createComponentSlot(Button)<DatePickerNavigationClassKey>({
    componentName: "DatePickerNavigation",
    slotName: "selectMonthButton",
    classesResolver() {
        return ["selectButton"];
    },
})(
    ({ theme }) => css`
        padding: 10px;
        border-radius: 4;
        font-weight: ${theme.typography.fontWeightBold};

        :hover {
            background-color: ${theme.palette.grey[50]};
        }

        & .${buttonClasses.endIcon} {
            margin-left: 2px;
        }
    `,
);

const SelectYearButton = createComponentSlot(Button)<DatePickerNavigationClassKey>({
    componentName: "DatePickerNavigation",
    slotName: "selectYearButton",
    classesResolver() {
        return ["selectButton"];
    },
})(
    ({ theme }) => css`
        padding: 10px;
        border-radius: 4;
        font-weight: ${theme.typography.fontWeightBold};

        :hover {
            background-color: ${theme.palette.grey[50]};
        }

        & .${buttonClasses.endIcon} {
            margin-left: 2px;
        }
    `,
);

const SelectMonthMenu = createComponentSlot(Menu)<DatePickerNavigationClassKey>({
    componentName: "DatePickerNavigation",
    slotName: "selectMonthMenu",
    classesResolver() {
        return ["selectMenu"];
    },
})(css`
    & .${menuClasses.paper} {
        min-width: 110px;
        max-height: 400px;
    }
`);

const SelectYearMenu = createComponentSlot(Menu)<DatePickerNavigationClassKey>({
    componentName: "DatePickerNavigation",
    slotName: "selectYearMenu",
    classesResolver() {
        return ["selectMenu"];
    },
})(css`
    & .${menuClasses.paper} {
        min-width: 110px;
        max-height: 400px;
    }
`);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDatePickerNavigation: DatePickerNavigationClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDatePickerNavigation: DatePickerNavigationProps;
    }

    interface Components {
        CometAdminDatePickerNavigation?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDatePickerNavigation"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDatePickerNavigation"];
        };
    }
}
