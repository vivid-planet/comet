import { Button, DataGridToolbar, FillSpace } from "@comet/admin";
import { ChangeImage } from "@comet/admin-icons";
import type { GridToolbarProps } from "@mui/x-data-grid";
import { type FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

export interface ActionGridToolbarProps extends GridToolbarProps {
    disableCompare: boolean;
    onClickCompare: () => void;
}

export const ActionGridToolbar: FunctionComponent<ActionGridToolbarProps> = ({ disableCompare, onClickCompare }) => {
    return (
        <DataGridToolbar>
            <FillSpace />

            <Button disabled={disableCompare} onClick={onClickCompare} startIcon={<ChangeImage />}>
                <FormattedMessage defaultMessage="Markierte Versionen vergleichen" id="actionLog.actionLogGrid.gridToolbar.compareMarkedVersions" />
            </Button>
        </DataGridToolbar>
    );
};
