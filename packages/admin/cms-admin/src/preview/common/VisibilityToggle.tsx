import { InvisibleItemHide, InvisibleItemShow } from "@comet/admin-icons";
import * as React from "react";
import { useIntl } from "react-intl";

import { ToggleButton } from "./ToggleButton";

interface Props {
    showOnlyVisible: boolean;
    onChange: (showOnlyVisible: boolean) => void;
}

function VisibilityToggle({ showOnlyVisible, onChange }: Props): React.ReactElement {
    const intl = useIntl();

    const handleToggleVisibilityClick = () => {
        onChange(!showOnlyVisible);
    };

    return (
        <ToggleButton
            value="showOnlyVisbile"
            onClick={handleToggleVisibilityClick}
            selected={!showOnlyVisible}
            title={intl.formatMessage({
                id: "comet.preview.showOnlyVisible",
                defaultMessage: "Show only visible blocks",
            })}
        >
            {showOnlyVisible ? <InvisibleItemHide /> : <InvisibleItemShow />}
        </ToggleButton>
    );
}

export { VisibilityToggle };
