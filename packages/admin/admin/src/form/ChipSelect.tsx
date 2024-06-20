import { ChevronDown } from "@comet/admin-icons";
import {
    Chip as MuiChip,
    ChipProps,
    ComponentsOverrides,
    InputBase as MuiInputBase,
    InputBaseProps,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type ChipSelectClassKey = "root" | "inputBase" | "inputRoot" | "chip" | "select";

const Root = createComponentSlot("div")<ChipSelectClassKey>({
    componentName: "ChipSelect",
    slotName: "root",
})();

const ChipInputRoot = createComponentSlot("div")<ChipSelectClassKey>({
    componentName: "ChipSelect",
    slotName: "inputRoot",
})(
    () => css`
        display: flex;
        flex-direction: column;
        position: relative;
    `,
);

const Chip = createComponentSlot(MuiChip)<ChipSelectClassKey>({
    componentName: "ChipSelect",
    slotName: "chip",
})(
    () =>
        css`
            justify-content: flex-start;
        `,
);

const InputBase = createComponentSlot(MuiInputBase)<ChipSelectClassKey>({
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
            inputRoot: "div";
            select: typeof Select;
            menuItem: typeof MenuItem;
            inputBase: typeof MuiInputBase;
        }>,
        Omit<ChipProps, "children" | "onChange"> {
    children?: React.ReactNode;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string;
    options?: T[];
    selectedOption?: T;
    onChange: (event: SelectChangeEvent) => void;
    fullWidth?: boolean;
}

const ChipInput = ({
    chipProps,
    inputBaseProps,
    inputRootProps,
    ...restProps
}: InputBaseProps & {
    chipProps?: Omit<ChipProps, "children">;
    inputBaseProps?: InputBaseProps;
    inputRootProps?: React.ComponentPropsWithoutRef<"div">;
}) => {
    return (
        <ChipInputRoot {...inputRootProps}>
            <Chip icon={<ChevronDown />} label={restProps.value?.toString().length ? restProps.value : ""} variant="filled" {...chipProps} />
            <InputBase
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                }}
                {...inputBaseProps}
                {...restProps}
            />
        </ChipInputRoot>
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
        fullWidth,
        className,
        ...chipProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminChipSelect",
    });

    return (
        <Root {...slotProps?.root} sx={fullWidth ? { ...slotProps?.root?.sx } : { ...slotProps?.root?.sx, width: "fit-content" }}>
            <Select
                {...slotProps?.select}
                value={selectedOption || ""}
                onChange={onChange}
                input={<ChipInput chipProps={chipProps} inputBaseProps={slotProps?.inputBase} inputRootProps={slotProps?.inputRoot} />}
            >
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
