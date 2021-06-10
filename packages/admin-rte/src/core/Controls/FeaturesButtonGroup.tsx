import { makeStyles } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import * as React from "react";

import { mergeClasses } from "../../mergeClasses";
import { IFeatureConfig } from "../types";
import ControlButton from "./ControlButton";

interface IProps {
    features: IFeatureConfig[];
    disabled?: boolean;
}

function FeaturesButtonGroup({
    features,
    disabled: globallyDisabled,
    classes: passedClasses,
}: IProps & StyledComponentProps<CometAdminRteFeaturesButtonGroupClassKeys>) {
    const classes = mergeClasses<CometAdminRteFeaturesButtonGroupClassKeys>(useStyles(), passedClasses);

    if (!features.length) {
        return null;
    }

    return (
        <div className={classes.root}>
            {features.map(({ name, onButtonClick, tooltipText, disabled, ...rest }) => (
                <div className={classes.buttonWrapper} key={name}>
                    {tooltipText ? (
                        <Tooltip title={tooltipText} placement="top">
                            <span>
                                <ControlButton onButtonClick={onButtonClick} disabled={globallyDisabled || disabled} {...rest} />
                            </span>
                        </Tooltip>
                    ) : (
                        <ControlButton onButtonClick={onButtonClick} disabled={globallyDisabled || disabled} {...rest} />
                    )}
                </div>
            ))}
        </div>
    );
}

export type CometAdminRteFeaturesButtonGroupClassKeys = "root" | "buttonWrapper";

const useStyles = makeStyles<Theme, {}, CometAdminRteFeaturesButtonGroupClassKeys>(
    () => {
        return {
            root: {
                display: "inline-flex",
                justifyContent: "flex-start",
            },
            buttonWrapper: {
                marginRight: 1,
                "&:last-child": {
                    marginRight: 0,
                },
            },
        };
    },
    { name: "CometAdminRteFeaturesButtonGroup" },
);

export default FeaturesButtonGroup;
