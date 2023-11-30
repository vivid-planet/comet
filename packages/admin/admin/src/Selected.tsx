import { ApolloError, useQuery } from "@apollo/client";
import { Box, Card, Typography } from "@mui/material";
import { DocumentNode } from "graphql";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Loading } from "./common/Loading";

interface IProps<Data extends { id: string | number } = { id: string | number }> {
    selectionMode?: "edit" | "add";
    selectedId?: string;
    rows?: Array<Data>;
    query?: DocumentNode;
    dataAccessor?: string;
    children: (data: Data | undefined, options: { selectionMode: "edit" | "add" }) => React.ReactNode;
    components?: {
        error?: React.ComponentType<{ error: ApolloError }>;
    };
}

const SelectEdit = <Data extends { id: string | number }>(props: IProps<Data>) => {
    const queryResult = useQuery(props.query!, { variables: { id: props.selectedId } });
    if (queryResult.error) {
        const ErrorComponent = props.components?.error;
        return ErrorComponent !== undefined ? (
            <ErrorComponent error={queryResult.error} />
        ) : (
            <Card>
                <Box padding={4}>
                    <Typography>
                        <FormattedMessage
                            id="comet.table.tableQuery.error"
                            defaultMessage="Error :( {error}"
                            description="Display apollo error message"
                            values={{
                                error: queryResult.error.toString(),
                            }}
                        />
                    </Typography>
                </Box>
            </Card>
        );
    }
    if (queryResult.loading || !queryResult.data) {
        return <Loading behavior="fillPageHeight" />;
    }
    if (!props.dataAccessor) {
        throw new Error("dataChild prop is required");
    }
    return <>{props.children(queryResult.data[props.dataAccessor], { selectionMode: "edit" })}</>;
};

export function Selected<Data extends { id: string | number }>(props: IProps<Data>) {
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
