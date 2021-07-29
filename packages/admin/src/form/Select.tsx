import { InputBase, Select as MuiSelect, SelectProps } from "@material-ui/core";
import * as React from "react";

export const Select: React.FunctionComponent<SelectProps> = (props) => <MuiSelect input={<InputBase />} {...props} />;
