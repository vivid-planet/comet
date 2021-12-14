import { ComponentsProps } from "@material-ui/core/styles/props";

import { getMuiAppBarProps } from "./MuiAppBar";
import { getMuiAutocompleteProps } from "./MuiAutocomplete";
import { getMuiButtonProps } from "./MuiButton";
import { getMuiButtonGroupProps } from "./MuiButtonGroup";
import { getMuiCheckboxProps } from "./MuiCheckbox";
import { getMuiLinkProps } from "./MuiLink";
import { getMuiListItemProps } from "./MuiListItem";
import { getMuiPaperProps } from "./MuiPaper";
import { getMuiPopoverProps } from "./MuiPopover";
import { getMuiRadioProps } from "./MuiRadio";
import { getMuiSelectProps } from "./MuiSelect";
import { getMuiSwitchProps } from "./MuiSwitch";
import { getMuiTabsProps } from "./MuiTabs";

export const getMuiProps = (): ComponentsProps => ({
    MuiCheckbox: getMuiCheckboxProps(),
    MuiRadio: getMuiRadioProps(),
    MuiAppBar: getMuiAppBarProps(),
    MuiPopover: getMuiPopoverProps(),
    MuiPaper: getMuiPaperProps(),
    MuiSwitch: getMuiSwitchProps(),
    MuiButton: getMuiButtonProps(),
    MuiButtonGroup: getMuiButtonGroupProps(),
    MuiSelect: getMuiSelectProps(),
    MuiAutocomplete: getMuiAutocompleteProps(),
    MuiLink: getMuiLinkProps(),
    MuiListItem: getMuiListItemProps(),
    MuiTabs: getMuiTabsProps(),
});
