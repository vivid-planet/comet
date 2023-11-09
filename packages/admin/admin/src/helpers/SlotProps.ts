import { Theme } from "@mui/material/styles";
import { MUIStyledCommonProps } from "@mui/system";
import React from "react";

export type SlotProps<Component extends React.ElementType> = Partial<React.ComponentProps<Component>> & MUIStyledCommonProps<Theme>;
