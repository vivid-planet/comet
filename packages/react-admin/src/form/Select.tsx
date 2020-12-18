import { Select as MuiSelect, SelectProps } from "@material-ui/core";
import * as React from "react";

import { Input } from "./Input";

export const Select: React.FunctionComponent<SelectProps> = (props) => <MuiSelect input={<Input />} {...props} />;
