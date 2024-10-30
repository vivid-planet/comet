import { FocusPointCenter, FocusPointNortheast, FocusPointNorthwest, FocusPointSoutheast, FocusPointSouthwest } from "@comet/admin-icons";
import { AdminComponentSection } from "@comet/blocks-admin";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { GQLFocalPoint } from "../../graphql.generated";

interface ChooseFocalPointProps {
    focalPoint: GQLFocalPoint;
    onChangeFocalPoint: (newFocalPoint: GQLFocalPoint) => void;
}

export const ChooseFocalPoint = ({ focalPoint, onChangeFocalPoint }: ChooseFocalPointProps) => {
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
                <ToggleButton value="SOUTHWEST">
                    <FocusPointSouthwest />
                </ToggleButton>
                <ToggleButton value="NORTHWEST">
                    <FocusPointNorthwest />
                </ToggleButton>
                <ToggleButton value="CENTER">
                    <FocusPointCenter />
                </ToggleButton>
                <ToggleButton value="NORTHEAST">
                    <FocusPointNortheast />
                </ToggleButton>
                <ToggleButton value="SOUTHEAST">
                    <FocusPointSoutheast />
                </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" paragraph style={{ marginBottom: 0 }}>
                <FormattedMessage
                    id="comet.blocks.image.hintSelectFocalPoint"
                    defaultMessage="You can also select the focus point by clicking on the bullets in the image."
                />
            </Typography>
        </AdminComponentSection>
    );
};
