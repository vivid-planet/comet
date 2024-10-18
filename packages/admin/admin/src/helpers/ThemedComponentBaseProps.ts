import { Theme } from "@mui/material/styles";
import { MUIStyledCommonProps, SxProps } from "@mui/system";
import { ComponentPropsWithRef, ElementType } from "react";

type SlotProps<Component extends ElementType> = Partial<ComponentPropsWithRef<Component>> & MUIStyledCommonProps<Theme>;

export type ThemedComponentBaseProps<Slots extends Record<string, ElementType> = never> = {
    sx?: SxProps<Theme>;
    className?: string;
    slotProps?: {
        [K in keyof Slots]?: SlotProps<Slots[K]>;
    };
};
