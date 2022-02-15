import { ApolloError, useQuery } from "@apollo/client";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { DocumentNode } from "graphql";
import * as React from "react";

interface IProps {
    selectionMode?: "edit" | "add";
    selectedId?: string;
    rows?: Array<{ id: string | number }>;
    query?: DocumentNode;
    dataAccessor?: string;
    children: (data: any, options: { selectionMode: "edit" | "add" }) => React.ReactNode;
    components?: {
        error?: React.ComponentType<{ error: ApolloError }>;
    };
}

const SelectEdit = (props: IProps) => {
    const queryResult = useQuery(props.query!, { variables: { id: props.selectedId } });
    if (queryResult.error) {
        const ErrorComponent = props.components?.error;
        return ErrorComponent !== undefined ? (
            <ErrorComponent error={queryResult.error} />
        ) : (
            <Card>
                <Box padding={4}>
                    <Typography>Error :( {queryResult.error.toString()}</Typography>
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

export function Selected(props: IProps) {
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
