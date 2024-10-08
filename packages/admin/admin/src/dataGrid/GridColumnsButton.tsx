import { Columns4 } from "@comet/admin-icons";
import { GridToolbarColumnsButton } from "@mui/x-data-grid";
import { ComponentProps } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

type Props = Omit<ComponentProps<typeof GridToolbarColumnsButton>, "onResize" | "onResizeCapture">;

export function GridColumnsButton(props: Props) {
    return (
        <GridToolbarColumnsButton
            startIcon={<Columns4 />}
            variant="outlined"
            color="info"
            onResize={undefined}
            onResizeCapture={undefined}
            {...props}
        >
            <FormattedMessage {...messages.columns} />
        </GridToolbarColumnsButton>
    );
}
