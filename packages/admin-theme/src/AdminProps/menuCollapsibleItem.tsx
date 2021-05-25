import { MenuCollapsibleItemThemeProps } from "@comet/admin";
import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import * as React from "react";

export const getMenuCollapsibleItemProps = (): MenuCollapsibleItemThemeProps => ({
    openedIcon: <ChevronUp />,
    closedIcon: <ChevronDown />,
});
