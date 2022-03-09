import { ApolloError, useQuery } from "@apollo/client";
import { Box, Card, CircularProgress } from "@material-ui/core";
import { DocumentNode } from "graphql";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface IProps {
    selectionMode?: "edit" | "add";
    selectedId?: string;
    rows?: Array<{ id: string | number }>;
    query?: DocumentNode;
    dataAccessor?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: (data: any, options: { selectionMode: "edit" | "add" }) => React.ReactNode;
    components?: {
        error?: React.ComponentType<{ error: ApolloError }>;
    };
}

const SelectEdit = (props: IProps) => {
    const queryResult = useQuery(props.query as DocumentNode, { variables: { id: props.selectedId } });
    if (queryResult.error) {
        const ErrorComponent = props.components?.error;
        return ErrorComponent !== undefined ? (
            <ErrorComponent error={queryResult.error} />
        ) : (
            <Card>
                <Box padding={4}>
                    <FormattedMessage
                        id="cometAdmin.table.tableQuery.error"
                        defaultMessage="Error :( {error}"
                        description="Display apollo error message"
                        values={{
                            error: queryResult.error.toString(),
                        }}
                    />
                </Box>
            </Card>
        );
    }
    if (queryResult.loading || !queryResult.data) {
        return (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }
    if (!props.dataAccessor) {
        throw new Error("dataChild prop is required");
    }
    return <>{props.children(queryResult.data[props.dataAccessor], { selectionMode: "edit" })}</>;
};

export function Selected(props: IProps): React.ReactElement | null {
    let row;
    if (props.rows) {
        row = props.rows.find((i) => String(i.id) === String(props.selectedId)); // compare as strings as selectedId might come from url
    }

    if (props.selectionMode === "edit" && !row) {
        if (!props.query) {
            return null;
        }
        return <SelectEdit {...props} />;
    } else {
        return (
            <React.Fragment>
                {props.selectionMode === "edit" && row && props.children(row, { selectionMode: "edit" })}
                {props.selectionMode === "add" && props.children(row, { selectionMode: "add" })}
            </React.Fragment>
        );
    }
}
