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
<<<<<<< HEAD
        <Button
            startIcon={<Filter />}
            variant="outlined"
            onClick={handleFilterClick}
            sx={(theme) => ({
                borderColor: theme.palette.grey[100],
            })}
        >
=======
        <ToolbarActionButton startIcon={<Filter />} variant="outlined" onClick={handleFilterClick} {...props}>
>>>>>>> main
            <FormattedMessage {...messages.filter} />
        </ToolbarActionButton>
    );
}
