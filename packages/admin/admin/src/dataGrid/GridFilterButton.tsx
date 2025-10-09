import { Filter } from "@comet/admin-icons";
import { Chip } from "@mui/material";
import { gridFilterModelSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { Button, type ButtonProps } from "../common/buttons/Button";
import { messages } from "../messages";

export function GridFilterButton(props: ButtonProps) {
    const apiRef = useGridApiContext();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const filterCount = filterModel.items.length;
    const handleFilterClick = useCallback(() => {
        apiRef.current.showFilterPanel();
    }, [apiRef]);

    return (
        <Button
            responsive
            startIcon={<Filter />}
            variant="outlined"
            onClick={handleFilterClick}
            {...props}
            endIcon={filterCount > 0 ? <Chip label={`${filterCount}`} /> : null}
        >
            <FormattedMessage {...messages.filter} />
        </Button>
    );
}
