import { ApolloError } from "@apollo/client/errors";
import { CircularProgress, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const OuterWrapper = styled("div")`
    position: relative;
`;

const LoadingContainer = styled("div")`
    position: sticky;
    top: 0;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.modal};
    transform: translate(50%, 200px);
`;

const LoadingPaper = styled(Paper)`
    display: flex;
    position: absolute;
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    height: 100px;
    width: 100px;
`;

interface InnerTableWrapperProps {
    error?: ApolloError;
    loading: boolean;
}

export const InnerTableWrapper: React.FunctionComponent<InnerTableWrapperProps> = ({ error, loading, children }) => {
    return (
        <OuterWrapper>
            <LoadingContainer>
                {loading && (
                    <LoadingPaper>
                        <CircularProgress />
                    </LoadingPaper>
                )}
            </LoadingContainer>
            {error && (
                <p>
                    <FormattedMessage
                        id="comet.table.tableQuery.error"
                        defaultMessage="Error :( {error}"
                        description="Display apollo error message"
                        values={{
                            error: error.toString(),
                        }}
                    />
                </p>
            )}
            {children}
        </OuterWrapper>
    );
};
