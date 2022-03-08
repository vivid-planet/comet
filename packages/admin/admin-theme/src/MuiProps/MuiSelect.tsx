import { ChevronDown } from "@comet/admin-icons";
import { SelectProps } from "@material-ui/core";
import * as React from "react";

export const getMuiSelectProps = (): SelectProps => ({
    IconComponent: ({ className }) => <ChevronDown classes={{ root: className }} />,
});
