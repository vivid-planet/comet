import { Filter } from "@comet/admin-icons";
import { useGridApiContext } from "@mui/x-data-grid";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { Button, ButtonProps } from "../common/buttons/Button";
import { messages } from "../messages";

export function GridFilterButton(props: ButtonProps) {
    const apiRef = useGridApiContext();

    const handleFilterClick = useCallback(() => {
        apiRef.current.showFilterPanel();
    }, [apiRef]);

    return (
        <Button responsive startIcon={<Filter />} variant="outlined" onClick={handleFilterClick} {...props}>
            <FormattedMessage {...messages.filter} />
        </Button>
    );
}
