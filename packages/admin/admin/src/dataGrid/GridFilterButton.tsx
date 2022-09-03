import { Filter } from "@comet/admin-icons";
import { Button } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export function GridFilterButton() {
    const apiRef = useGridApiContext();
    const handleFilterClick = React.useCallback(() => {
        apiRef.current.showFilterPanel();
    }, [apiRef]);
    return (
        <Button startIcon={<Filter />} variant="text" color="info" onClick={handleFilterClick}>
            <FormattedMessage id="comet.core.filter" defaultMessage="Filter" />
        </Button>
    );
}
