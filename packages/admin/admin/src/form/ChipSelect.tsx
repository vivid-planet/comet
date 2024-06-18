import { ChevronDown } from "@comet/admin-icons";
import { Box, Chip, ChipProps, ComponentsOverrides, InputBase, InputBaseProps, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type ChipSelectClassKey = "root" | "inputBase" | "chip" | "select";

const Root = createComponentSlot("div")<ChipSelectClassKey>({
    componentName: "ChipSelect",
    slotName: "root",
})();

const CustomInputBase = createComponentSlot(InputBase)<ChipSelectClassKey>({
    componentName: "ChipSelect",
    slotName: "inputBase",
})(
    () => css`
        .MuiInputBase-input {
            padding: 0;
            height: 100% !important;
            min-height: unset !important;
        }
    `,
);

export interface ChipSelectProps<T = string>
    extends ThemedComponentBaseProps<{
        root: "div";
        chip: typeof Chip;
        select: typeof Select;
        menuItem: typeof MenuItem;
    }> {
    children?: React.ReactNode;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string;
    options?: T[];
    selectedOption?: T;
    onChange: (event: SelectChangeEvent) => void;
}

const ChipInput = ({ chipProps, ...p }: InputBaseProps & { chipProps?: Omit<ChipProps, "children"> }) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <Chip
                icon={<ChevronDown />}
                label={
                    p.value?.toString().length ? (
                        p.value
                    ) : (
                        <FormattedMessage id="comet.admin.form.chipselect.placeholder" defaultMessage="Select a value" />
                    )
                }
                variant="filled"
                {...chipProps}
            />
            <CustomInputBase
                size="small"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                }}
                {...p}
            />
        </Box>
    );
};

export function ChipSelect<T = string>(inProps: ChipSelectProps<T>) {
    const {
        options,
        getOptionLabel = (option: T) => {
            if (typeof option === "object" && option !== null) {
                if ((option as any).label) return String((option as any).label);
                if ((option as any).id) return String((option as any).id);
                if ((option as any).value) return String((option as any).value);
                return JSON.stringify(option);
            } else {
                return String(option);
            }
        },
        getOptionValue = (option: T) => {
            if (typeof option === "object" && option !== null) {
                if ((option as any).value) return String((option as any).value);
                if ((option as any).id) return String((option as any).id);
                return JSON.stringify(option);
            } else {
                return String(option);
            }
        },
        selectedOption,
        children,
        slotProps,
        onChange,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminChipSelect",
    });

    return (
        <Root {...slotProps?.root} {...restProps}>
            <Select {...slotProps?.select} value={selectedOption || ""} onChange={onChange} input={<ChipInput chipProps={slotProps?.chip} />}>
                {children ??
                    options?.map((option) => (
                        <MenuItem {...slotProps?.menuItem} key={getOptionValue(option)} value={getOptionValue(option)} autoFocus={false}>
                            {getOptionLabel(option)}
                        </MenuItem>
                    ))}
            </Select>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminChipSelect: ChipSelectClassKey;
    }

    interface ComponentsPropsList {
        CometAdminChipSelect: ChipSelectProps;
    }

    interface Components {
        CometAdminChipSelect?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminChipSelect"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminChipSelect"];
        };
    }
}
