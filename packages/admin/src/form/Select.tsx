import { InputBase, Select as MuiSelect, SelectProps } from "@mui/material";
import * as React from "react";

export const Select: React.FunctionComponent<SelectProps> = (props) => <MuiSelect input={<InputBase />} {...props} />;
