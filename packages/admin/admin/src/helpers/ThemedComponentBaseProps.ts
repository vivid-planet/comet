import { type Theme } from "@mui/material/styles";
import { type MUIStyledCommonProps, type SxProps } from "@mui/system";
import { type ComponentPropsWithRef, type ElementType } from "react";

type SlotProps<Component extends ElementType> = Partial<ComponentPropsWithRef<Component>> & MUIStyledCommonProps<Theme>;

export type ThemedComponentBaseProps<Slots extends Record<string, ElementType> = never> = {
    sx?: SxProps<Theme>;
    className?: string;
    slotProps?: {
        [K in keyof Slots]?: SlotProps<Slots[K]>;
    };
};
