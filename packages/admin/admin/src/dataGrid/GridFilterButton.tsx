import { Filter } from "@comet/admin-icons";
import { Chip } from "@mui/material";
import { gridFilterModelSelector, GridPreferencePanelsValue, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { useCallback, useRef } from "react";
import { FormattedMessage } from "react-intl";

import { Button, type ButtonProps } from "../common/buttons/Button";
import { messages } from "../messages";

export function GridFilterButton(props: ButtonProps) {
    const apiRef = useGridApiContext();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const filterCount = filterModel.items.length;
    const filterPanelOpenRef = useRef(false);

    const handleMouseDown = useCallback(() => {
        const { open, openedPanelValue } = apiRef.current.state.preferencePanel;
        filterPanelOpenRef.current = open && openedPanelValue === GridPreferencePanelsValue.filters;
    }, [apiRef]);

    const handleFilterClick = useCallback(() => {
        if (filterPanelOpenRef.current) {
            // Panel was open on mousedown; ClickAwayListener already closed it, so do nothing.
            return;
        }
        apiRef.current.showFilterPanel();
    }, [apiRef]);

    return (
        <Button
            responsive
            startIcon={<Filter />}
            variant="outlined"
            onMouseDown={handleMouseDown}
            onClick={handleFilterClick}
            endIcon={filterCount > 0 ? <Chip label={`${filterCount}`} size="small" /> : null}
            sx={{
                maxHeight: "40px",
            }}
            {...props}
        >
            <FormattedMessage {...messages.filter} />
        </Button>
    );
}
