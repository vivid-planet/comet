import { Divider as MuiDivider, DividerProps as MuiDividerProps } from "@mui/material";
import * as React from "react";

export type DividerProps = Omit<MuiDividerProps, "orientation" | "variant">;

export const Divider: React.FC<DividerProps> = () => null;

export const CustomDivider: React.FC<DividerProps> = ({ children, ...props }) => {
    return (
        <MuiDivider
            sx={(theme) => ({
                margin: theme.spacing("auto", 3),
                borderWidth: 1,
                borderColor: theme.palette.grey[200],
                height: 20,
            })}
            flexItem
            {...props}
            orientation="vertical"
        />
    );
};
