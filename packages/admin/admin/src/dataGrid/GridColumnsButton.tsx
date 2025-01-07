import { Columns4 } from "@comet/admin-icons";
import { ButtonProps } from "@mui/material";
import { GridPreferencePanelsValue, useGridApiContext } from "@mui/x-data-grid";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { ToolbarActionButton } from "../common/toolbar/actions/ToolbarActionButton";
import { messages } from "../messages";

<<<<<<< HEAD
type Props = ComponentProps<typeof GridToolbarColumnsButton>;
=======
export function GridColumnsButton(props: ButtonProps) {
    const apiRef = useGridApiContext();

    const handleFilterClick = useCallback(() => {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    }, [apiRef]);
>>>>>>> main

    return (
<<<<<<< HEAD
        <GridToolbarColumnsButton
            {...props}
            slotProps={{
                ...props.slotProps,
                button: {
                    variant: "outlined",
                    startIcon: <Columns4 />,
                    children: <FormattedMessage {...messages.columns} />,
                    color: "info",
                    ...props.slotProps?.button,
                },
            }}
        />
=======
        <ToolbarActionButton startIcon={<Columns4 />} variant="outlined" onClick={handleFilterClick} {...props}>
            <FormattedMessage {...messages.columns} />
        </ToolbarActionButton>
>>>>>>> main
    );
}
