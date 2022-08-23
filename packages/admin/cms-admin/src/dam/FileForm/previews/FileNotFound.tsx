import { Error } from "@comet/admin-icons";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

const FileNotFoundWrapper = styled("div")`
    width: 100%;
    min-height: 400px;
    background-color: ${({ theme }) => theme.palette.grey[50]};

    display: flex;
    justify-content: center;
    align-items: center;
`;

const InnerWrapper = styled(Box)`
    height: 150px;
    background: white;
    padding: 0 20px;
    border: ${({ theme }) => theme.palette.error.main} solid 2px;
    border-radius: 10px;

    display: flex;
    justify-content: center;
    gap: 16px;
    align-items: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled(Error)`
    color: ${({ theme }) => theme.palette.error.main};
    width: 54px;
    height: 72px;
`;

export const FileNotFound = (): React.ReactElement => {
    return (
        <FileNotFoundWrapper>
            <InnerWrapper>
                <ErrorIcon />
                <Typography variant="h3" component="p">
                    <FormattedMessage id="comet.dam.filePreview.error" defaultMessage="File not found" />
                </Typography>
            </InnerWrapper>
        </FileNotFoundWrapper>
    );
};
