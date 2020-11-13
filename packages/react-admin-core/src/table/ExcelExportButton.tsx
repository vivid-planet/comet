import { Button, CircularProgress, Typography } from "@material-ui/core";
import { FileIcon } from "@vivid-planet/file-icons";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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
            color="default"
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
            <Typography variant="button">
                {children != null ? (
                    children
                ) : (
                    <FormattedMessage id="reactAdmin.core.table.excelExportButton" defaultMessage="Export" description="Export Button" />
                )}
            </Typography>
        </Button>
    );
};
