import { Columns4 } from "@comet/admin-icons";
import { ButtonProps } from "@mui/material";
import { GridPreferencePanelsValue, useGridApiContext } from "@mui/x-data-grid";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { ToolbarActionButton } from "../common/toolbar/actions/ToolbarActionButton";
import { messages } from "../messages";

export function GridColumnsButton(props: ButtonProps) {
    const apiRef = useGridApiContext();

    const handleFilterClick = useCallback(() => {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    }, [apiRef]);

    return (
        <ToolbarActionButton startIcon={<Columns4 />} variant="outlined" onClick={handleFilterClick} {...props}>
            <FormattedMessage {...messages.columns} />
        </ToolbarActionButton>
    );
}
