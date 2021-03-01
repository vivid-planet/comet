import { Select as MuiSelect, SelectProps } from "@material-ui/core";
import * as React from "react";

import { InputBase } from "./InputBase";

export const Select: React.FunctionComponent<SelectProps> = (props) => <MuiSelect input={<InputBase />} {...props} />;
