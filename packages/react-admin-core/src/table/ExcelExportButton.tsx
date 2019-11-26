import Button from "@material-ui/core/Button";
import { FileIcon } from "@vivid-planet/file-icons";
import * as React from "react";
import styled from "styled-components";
import { IExportExcelApi } from "./excelexport/IExportExcelApi";

interface IProps {
    exportApi: IExportExcelApi<any>;
    onClick?: () => void;
    loadingComponent?: React.ReactNode;
}

const TextContainer = styled.div`
    margin-left: 8px;
`;

export const ExcelExportButton: React.FunctionComponent<IProps> = ({ onClick, children, exportApi, loadingComponent }) => {
    const onClickButtonPressed = () => {
        if (onClick != null) {
            onClick();
        } else {
            exportApi.exportTable();
        }
    };

    const loading = exportApi.generationState != null && exportApi.generationState.generating;
    const formattedProgress =
        exportApi.generationState && exportApi.generationState.progress ? (exportApi.generationState.progress * 100).toFixed(0) : null;
    const loadingText = exportApi.generationState && formattedProgress ? `(${formattedProgress}%)` : "Laden ...";
    return (
        <Button color="default" onClick={onClickButtonPressed}>
            <FileIcon fileType={"application/msexcel"} />
            <TextContainer>{children != null ? children : "Export"}</TextContainer>
            {loading && (loadingComponent ? loadingComponent : <TextContainer>{loadingText}</TextContainer>)}
        </Button>
    );
};
