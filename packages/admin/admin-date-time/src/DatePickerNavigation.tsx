import { ArrowLeft, ArrowRight, ChevronDown } from "@comet/admin-icons";
import { Box, Button, buttonClasses, ComponentsOverrides, IconButton, Menu, menuClasses, MenuItem } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { useIntl } from "react-intl";

export interface DatePickerNavigationProps {
    focusedDate: Date;
    changeShownDate: (value: number, mode: "setYear" | "setMonth" | "monthOffset") => void;
    minDate: Date;
    maxDate: Date;
}

const DatePickerNavigation = ({ classes, focusedDate, changeShownDate, minDate, maxDate }: DatePickerNavigationProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    const [showMonthSelect, setShowMonthSelect] = React.useState<boolean>(false);
    const [showYearSelect, setShowYearSelect] = React.useState<boolean>(false);

    const monthSelectRef = React.useRef<HTMLButtonElement>(null);
    const yearSelectRef = React.useRef<HTMLButtonElement>(null);

    return (
        <Box className={classes.root}>
            <IconButton onClick={() => changeShownDate(-1, "monthOffset")}>
                <ArrowLeft />
            </IconButton>

            <Box>
                <Button
                    size="small"
                    className={clsx(classes.selectButton, classes.selectMonthButton)}
                    onClick={() => setShowMonthSelect(true)}
                    ref={monthSelectRef}
                    endIcon={<ChevronDown />}
                >
                    {intl.formatDate(focusedDate, { month: "long" })}
                </Button>
                <Menu
                    className={clsx(classes.selectMenu, classes.selectMonthMenu)}
                    open={showMonthSelect}
                    onClose={() => setShowMonthSelect(false)}
                    anchorEl={monthSelectRef.current}
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
                </Menu>
                <Button
                    size="small"
                    className={clsx(classes.selectButton, classes.selectYearButton)}
                    ref={yearSelectRef}
                    onClick={() => setShowYearSelect(true)}
                    endIcon={<ChevronDown />}
                >
                    {focusedDate.getFullYear()}
                </Button>
                <Menu
                    className={clsx(classes.selectMenu, classes.selectYearMenu)}
                    open={showYearSelect}
                    onClose={() => setShowYearSelect(false)}
                    anchorEl={yearSelectRef.current}
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
                </Menu>
            </Box>
            <IconButton onClick={() => changeShownDate(+1, "monthOffset")}>
                <ArrowRight />
            </IconButton>
        </Box>
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

export const styles = ({ palette, spacing, typography }: Theme) => {
    return createStyles<DatePickerNavigationClassKey, DatePickerNavigationProps>({
        root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: spacing(2),
            paddingRight: spacing(2),
            borderBottom: `1px solid ${palette.grey[50]}`,
            height: 50,
        },
        selectButton: {
            padding: 10,
            borderRadius: 4,
            fontWeight: typography.fontWeightBold,

            "&:hover": {
                backgroundColor: palette.grey[50],
            },

            [`& .${buttonClasses.endIcon}`]: {
                marginLeft: 2,
            },
        },
        selectMonthButton: {},
        selectYearButton: {},
        selectMenu: {
            [`& .${menuClasses.paper}`]: {
                minWidth: 110,
                maxHeight: 400,
            },
        },
        selectMonthMenu: {},
        selectYearMenu: {},
    });
};

const DatePickerNavigationWithStyles = withStyles(styles, { name: "CometAdminDatePickerNavigation" })(DatePickerNavigation);

export { DatePickerNavigationWithStyles as DatePickerNavigation };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDatePickerNavigation: DatePickerNavigationClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDatePickerNavigation: Partial<DatePickerNavigationProps>;
    }

    interface Components {
        CometAdminDatePickerNavigation?: {
            defaultProps?: ComponentsPropsList["CometAdminDatePickerNavigation"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDatePickerNavigation"];
        };
    }
}
