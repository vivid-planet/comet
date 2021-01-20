import { Box } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import * as React from "react";

import { IFeatureConfig } from "../types";
import ControlButton from "./ControlButton";
import * as sc from "./FeaturesButtonGroup.sc";

interface IProps {
    features: IFeatureConfig[];
    disabled?: boolean;
}

export default function FeaturesButtonGroup({ features, disabled: globallyDisabled }: IProps) {
    if (!features.length) {
        return null;
    }

    return (
        <Box display="inline-flex" justifyContent="flex-start">
            {features.map(({ name, onButtonClick, tooltipText, disabled, ...rest }) => (
                <sc.ButtonWrapper key={name}>
                    {tooltipText ? (
                        <Tooltip title={tooltipText} placement="top">
                            <span>
                                <ControlButton onButtonClick={onButtonClick} disabled={globallyDisabled || disabled} {...rest} />
                            </span>
                        </Tooltip>
                    ) : (
                        <ControlButton onButtonClick={onButtonClick} disabled={globallyDisabled || disabled} {...rest} />
                    )}
                </sc.ButtonWrapper>
            ))}
        </Box>
    );
}
