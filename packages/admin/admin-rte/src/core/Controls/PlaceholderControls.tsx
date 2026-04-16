import { ButtonGroup } from "@mui/material";

import PlaceholderToolbarButton from "../extension/Placeholder/ToolbarButton";
import { type IControlProps } from "../types";

function PlaceholderControls(props: IControlProps) {
    const {
        options: { placeholders },
    } = props;

    if (!placeholders || placeholders.length === 0) {
        return null;
    }

    return (
        <ButtonGroup>
            <PlaceholderToolbarButton {...props} />
        </ButtonGroup>
    );
}

export default PlaceholderControls;
