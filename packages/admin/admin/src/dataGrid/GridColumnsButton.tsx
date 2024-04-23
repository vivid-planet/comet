import { Columns4 } from "@comet/admin-icons";
import { GridToolbarColumnsButton } from "@mui/x-data-grid/components/toolbar/GridToolbarColumnsButton";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

type Props = Omit<React.ComponentProps<typeof GridToolbarColumnsButton>, "onResize" | "onResizeCapture">;

export function GridColumnsButton({ ...restProps }: Props) {
    return (
        <GridToolbarColumnsButton
            startIcon={<Columns4 />}
            variant="outlined"
            color="info"
            onResize={undefined}
            onResizeCapture={undefined}
            {...restProps}
        >
            <FormattedMessage {...messages.columns} />
        </GridToolbarColumnsButton>
    );
}
