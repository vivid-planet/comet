import { WithStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

import { IFeatureConfig } from "../types";
import ControlButton from "./ControlButton";

interface IProps {
    features: IFeatureConfig[];
    disabled?: boolean;
}

function FeaturesButtonGroup({ features, disabled: globallyDisabled, classes }: IProps & WithStyles<typeof styles>) {
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

export type RteFeaturesButtonGroupClassKey = "root" | "buttonWrapper";

const styles = () => {
    return createStyles<RteFeaturesButtonGroupClassKey, IProps>({
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
    });
};

export default withStyles(styles, { name: "CometAdminRteFeaturesButtonGroup" })(FeaturesButtonGroup);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRteFeaturesButtonGroup: RteFeaturesButtonGroupClassKey;
    }
}
