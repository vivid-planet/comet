import { Filter } from "@comet/admin-icons";
import { ButtonProps } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { ToolbarActionButton } from "../common/toolbar/actions/ToolbarActionButton";
import { messages } from "../messages";

export function GridFilterButton(props: ButtonProps) {
    const apiRef = useGridApiContext();

    const handleFilterClick = useCallback(() => {
        apiRef.current.showFilterPanel();
    }, [apiRef]);

    return (
        <ToolbarActionButton startIcon={<Filter />} variant="outlined" onClick={handleFilterClick} {...props}>
            <FormattedMessage {...messages.filter} />
        </ToolbarActionButton>
    );
}
