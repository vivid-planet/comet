import { Icon, IconButton } from "@dextinity/ui";
import { useIntl } from "react-intl";

import { messages } from "../messages";

type InputClearButtonProps = {
    onClick: () => void;
};

export const InputClearButton = ({ onClick }: InputClearButtonProps) => {
    const intl = useIntl();

    return (
        <IconButton
            label={intl.formatMessage(messages.clear)}
            size="small"
            onClick={(event) => {
                // Prevent the click from reaching the surrounding control, which could handle it, e.g., by opening a select's list.
                event.stopPropagation();
                onClick();
            }}
        >
            <Icon name="close" />
        </IconButton>
    );
};
