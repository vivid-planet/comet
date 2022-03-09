import { AdminComponentSection } from "@comet/admin-blocks";
import { FocusPointCenter, FocusPointNortheast, FocusPointNorthwest, FocusPointSoutheast, FocusPointSouthwest } from "@comet/admin-icons";
import { Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLFocalPoint } from "../../graphql.generated";

interface ChooseFocalPointProps {
    focalPoint: GQLFocalPoint;
    onChangeFocalPoint: (newFocalPoint: GQLFocalPoint) => void;
}

export const ChooseFocalPoint = ({ focalPoint, onChangeFocalPoint }: ChooseFocalPointProps): React.ReactElement => {
    return (
        <AdminComponentSection title={<FormattedMessage id="comet.blocks.image.focalPoint" defaultMessage="Set manual focus point" />}>
            <ToggleButtonGroup
                value={focalPoint}
                onChange={(event, newFocalPoint: GQLFocalPoint) => {
                    if (newFocalPoint === null) {
                        return;
                    }

                    onChangeFocalPoint(newFocalPoint);
                }}
                exclusive
            >
                <ToggleButton value={"SOUTHWEST"}>
                    <FocusPointSouthwest />
                </ToggleButton>
                <ToggleButton value={"NORTHWEST"}>
                    <FocusPointNorthwest />
                </ToggleButton>
                <ToggleButton value={"CENTER"}>
                    <FocusPointCenter />
                </ToggleButton>
                <ToggleButton value={"NORTHEAST"}>
                    <FocusPointNortheast />
                </ToggleButton>
                <ToggleButton value={"SOUTHEAST"}>
                    <FocusPointSoutheast />
                </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="body2" component="p" color="textSecondary">
                <FormattedMessage
                    id="comet.blocks.image.hintSelectFocalPoint"
                    defaultMessage="You can also select the focus point by clicking on the bullets in the image."
                />
            </Typography>
        </AdminComponentSection>
    );
};
