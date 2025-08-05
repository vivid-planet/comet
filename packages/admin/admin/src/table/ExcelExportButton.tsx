import { CircularProgress } from "@mui/material";
import { type PropsWithChildren, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "../common/buttons/Button";
import { FileIcon } from "../fileIcons/FileIcon";
import { type IExportApi } from "./excelexport/IExportApi";

interface IProps {
    exportApi: IExportApi<any>;
    onClick?: () => void;
    loadingComponent?: ReactNode;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export const ExcelExportButton = ({ onClick, children, exportApi, loadingComponent }: PropsWithChildren<IProps>) => {
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
            variant="textDark"
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
                    <FileIcon fileType="application/msexcel" />
                )
            }
        >
            {children != null ? (
                children
            ) : (
                <FormattedMessage id="comet.table.excelExportButton" defaultMessage="Export" description="Export Button" />
            )}
        </Button>
    );
};
