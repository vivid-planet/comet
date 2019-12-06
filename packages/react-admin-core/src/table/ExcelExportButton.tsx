import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { FileIcon } from "@vivid-planet/file-icons";
import * as React from "react";
import styled from "styled-components";
import { IExportApi } from "./excelexport/IExportApi";

interface IProps {
    exportApi: IExportApi<any>;
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

    const { loading } = exportApi;

    return (
        <Button color="default" onClick={onClickButtonPressed}>
            {loading ? <>{loadingComponent ? loadingComponent : <CircularProgress size={23} />}</> : <FileIcon fileType={"application/msexcel"} />}

            <TextContainer>{children != null ? children : "Export"}</TextContainer>
        </Button>
    );
};
