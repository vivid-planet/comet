import { ChevronDown } from "@comet/admin-icons";
import { InputAdornment, InputBase, Select as MuiSelect, SelectProps } from "@mui/material";
import * as React from "react";

type IconProps = {
    className: string;
};

const Icon = ({ className }: IconProps) => (
    <InputAdornment position="end" className={className}>
        <ChevronDown />
    </InputAdornment>
);

export const Select = ({ IconComponent = Icon, ...restProps }: SelectProps): React.ReactElement => {
    return <MuiSelect IconComponent={IconComponent} input={<InputBase />} {...restProps} />;
};
