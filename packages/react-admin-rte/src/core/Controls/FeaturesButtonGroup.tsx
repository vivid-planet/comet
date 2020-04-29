import { Box } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import * as React from "react";
import { IFeatureConfig } from "../types";
import ControlButton from "./ControlButton";
import * as sc from "./FeaturesButtonGroup.sc";

interface IProps {
    features: IFeatureConfig[];
}

export default function FeaturesButtonGroup({ features }: IProps) {
    if (!features.length) {
        return null;
    }

    return (
        <Box display="inline-flex" justifyContent="flex-start">
            {features.map(({ name, onButtonClick, tooltipText, ...rest }) => {
                const Button: React.FC = () => <ControlButton onButtonClick={onButtonClick} {...rest} />;

                return (
                    <sc.ButtonWrapper key={name}>
                        {tooltipText ? (
                            <Tooltip title={tooltipText} placement="top">
                                <Button />
                            </Tooltip>
                        ) : (
                            <Button />
                        )}
                    </sc.ButtonWrapper>
                );
            })}
        </Box>
    );
}
