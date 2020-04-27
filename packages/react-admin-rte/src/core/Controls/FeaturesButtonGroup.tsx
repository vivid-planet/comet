import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButtonBase from "@material-ui/core/IconButton";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import Tooltip from "@material-ui/core/Tooltip";
import * as React from "react";
import { IFeatureConfig } from "../types";

interface IIconButtonProps {
    disabled?: boolean;
    selected?: boolean;
    onMouseDown?: (e: React.MouseEvent) => void;
    label: string;
    Icon?: (props: SvgIconProps) => JSX.Element;
}

function IconButton({ disabled, selected, onMouseDown, Icon, label }: IIconButtonProps) {
    return (
        <IconButtonBase disabled={disabled} color={selected ? "primary" : "default"} onMouseDown={onMouseDown}>
            {Icon ? <Icon /> : label}
        </IconButtonBase>
    );
}

interface IProps {
    features: IFeatureConfig[];
}

export default function FeaturesButtonGroup({ features }: IProps) {
    if (!features.length) {
        return null;
    }
    return (
        <ButtonGroup>
            {features.map(({ name, onButtonClick, tooltipText, ...rest }) =>
                tooltipText ? (
                    <Tooltip key={name} title={tooltipText} placement="top">
                        <span>
                            <IconButton onMouseDown={onButtonClick} {...rest} />
                        </span>
                    </Tooltip>
                ) : (
                    <IconButton onMouseDown={onButtonClick} {...rest} />
                ),
            )}
        </ButtonGroup>
    );
}
