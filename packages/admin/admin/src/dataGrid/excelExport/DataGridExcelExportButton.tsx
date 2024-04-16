import { Button, CircularProgress } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { FileIcon } from "../../fileIcons/FileIcon";
import { ExportApi } from "./useDataGridExcelExport";

interface Props {
    exportApi: ExportApi;
    onClick?: () => void;
    loadingComponent?: React.ReactNode;
    onError?: () => void;
}

export const DataGridExcelExportButton: React.FunctionComponent<Props> = ({ onClick, children, exportApi, loadingComponent, onError }) => {
    const onClickButtonPressed = () => {
        if (onClick != null) {
            onClick();
        } else {
            exportApi.exportGrid();
        }
    };

    const { loading, error } = exportApi;

    if (error && onError) {
        onError();
    }

    return (
        <Button
            onClick={onClickButtonPressed}
            startIcon={
                loading ? <>{loadingComponent ? loadingComponent : <CircularProgress size={23} />}</> : <FileIcon fileType="application/msexcel" />
            }
        >
            {children != null ? (
                children
            ) : (
                <FormattedMessage id="comet.dataGrid.excelExportButton" defaultMessage="Export" description="Export Button" />
            )}
        </Button>
    );
};
