import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import * as React from "react";
import { IFeatureConfig } from "../types";

interface IProps {
    features: IFeatureConfig[];
}
export default function FeaturesButtonGroup({ features }: IProps) {
    if (!features.length) {
        return null;
    }
    return (
        <ButtonGroup>
            {features.map(({ name, label, disabled, selected, onButtonClick, Icon }) => (
                <IconButton key={name} disabled={disabled} color={selected ? "primary" : "default"} onMouseDown={onButtonClick}>
                    {Icon ? <Icon /> : label}
                </IconButton>
            ))}
        </ButtonGroup>
    );
}
