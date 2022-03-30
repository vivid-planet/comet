import { Button, CircularProgress } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { FileIcon } from "../fileIcons/FileIcon";
import { IExportApi } from "./excelexport/IExportApi";

interface IProps {
    exportApi: IExportApi<any>;
    onClick?: () => void;
    loadingComponent?: React.ReactNode;
}

export const ExcelExportButton: React.FunctionComponent<IProps> = ({ onClick, children, exportApi, loadingComponent }) => {
    const onClickButtonPressed = () => {
        if (onClick != null) {
            onClick();
        } else {
            exportApi.exportTable();
        }
    };

    const { loading, progress } = exportApi;

    return (
        <Button
            onClick={onClickButtonPressed}
            startIcon={
                loading ? (
                    <>
                        {loadingComponent ? (
                            loadingComponent
                        ) : (
                            <CircularProgress size={23} variant={progress ? "determinate" : "indeterminate"} value={progress} />
                        )}
                    </>
                ) : (
                    <FileIcon fileType={"application/msexcel"} />
                )
            }
        >
            {children != null ? (
                children
            ) : (
                <FormattedMessage id="cometAdmin.table.excelExportButton" defaultMessage="Export" description="Export Button" />
            )}
        </Button>
    );
};
