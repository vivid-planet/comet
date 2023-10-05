import { ApolloError } from "@apollo/client/errors";
import { Loading } from "@comet/admin";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const OuterWrapper = styled("div")`
    position: relative;
    flex-grow: 1;
`;

interface InnerTableWrapperProps {
    error?: ApolloError;
    loading: boolean;
}

export const InnerTableWrapper: React.FunctionComponent<InnerTableWrapperProps> = ({ error, loading, children }) => {
    return (
        <OuterWrapper>
            {loading ? (
                <Loading behavior="fillParentAbsolute" />
            ) : (
                <>
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
                </>
            )}
        </OuterWrapper>
    );
};
