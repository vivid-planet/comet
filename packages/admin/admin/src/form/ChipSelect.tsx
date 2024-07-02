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

type OwnerState = {
    fullWidth: boolean;
};

const Root = createComponentSlot("div")<ChipSelectClassKey, OwnerState>({
    componentName: "ChipSelect",
    slotName: "root",
})(
    ({ ownerState }) => css`
        ${!ownerState.fullWidth &&
        css`
            width: fit-content;
        `}
    `,
);

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
        position: absolute;
        inset: 0;
        opacity: 0;

        .MuiInputBase-input {
            padding: 0;
            height: 100% !important;
            min-height: unset !important;
        }
    `,
);

const LabelInputBase = createComponentSlot(MuiInputBase)<ChipSelectClassKey>({
    componentName: "ChipSelect",
    slotName: "inputBase",
})(
    () => css`
        all: unset;
        padding-right: 0 !important;

        > div {
            padding-right: 0 !important;
        }

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

type ChipInputProps = InputBaseProps & {
    chipProps?: ChipProps;
    inputBaseProps?: InputBaseProps;
    inputRootProps?: React.ComponentPropsWithoutRef<"div">;
};

const ChipInput = ({ chipProps, inputBaseProps, inputRootProps, ...restProps }: ChipInputProps) => (
    <ChipInputRoot {...inputRootProps}>
        <Chip
            icon={<ChevronDown />}
            label={<LabelInputBase {...inputBaseProps} {...restProps} />} // use second InputBase to show the label
            variant="filled"
            {...chipProps}
        />
        <InputBase {...inputBaseProps} {...restProps} />
    </ChipInputRoot>
);

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
        fullWidth = false,
        className,
        ...chipProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminChipSelect",
    });

    const ownerState = { fullWidth };

    return (
        <Root {...slotProps?.root} ownerState={ownerState}>
            <Select
                {...slotProps?.select}
                value={selectedOption || ""}
                onChange={onChange}
                input={<ChipInput chipProps={chipProps} inputBaseProps={slotProps?.inputBase} inputRootProps={slotProps?.inputRoot} />}
                inputProps={{ IconComponent: () => null }} // hide icon of InputBase
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
