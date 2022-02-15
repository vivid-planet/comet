import { ChevronDown } from "@comet/admin-icons";
import { SelectProps } from "@mui/material";
import * as React from "react";

export const getMuiSelectProps = (): SelectProps => ({
    IconComponent: ({ className }) => <ChevronDown classes={{ root: className }} />,
});
