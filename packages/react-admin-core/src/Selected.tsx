import { useQuery } from "@apollo/react-hooks";
import { CircularProgress } from "@material-ui/core";
import { DocumentNode } from "graphql";
import * as React from "react";
import styled from "styled-components";

interface IProps {
    selectionMode: "edit" | "add";
    selectedId?: string;
    rows?: Array<{ id: string | number }>;
    query?: DocumentNode;
    dataAccessor?: string;
    children: (data: any, options: { selectionMode: "edit" | "add" }) => React.ReactNode;
}
const ProgressContainer = styled.div`
    padding-top: 30px;
    display: flex;
    justify-content: center;
`;

export function Selected(props: IProps) {
    let row;
    if (props.rows) {
        row = props.rows.find(i => String(i.id) === String(props.selectedId)); // compare as strings as selectedId might come from url
    }
    const queryResult = props.query ? useQuery(props.query, { variables: { id: props.selectedId } }) : undefined;

    if (props.selectionMode === "edit" && !row) {
        if (!props.query || !queryResult) {
            return null;
        }
        if (queryResult.loading || !queryResult.data) {
            return (
                <ProgressContainer>
                    <CircularProgress />
                </ProgressContainer>
            );
        }
        if (queryResult.error) return <p>Error :( {queryResult.error.toString()}</p>;
        if (!props.dataAccessor) {
            throw new Error("dataChild prop is required");
        }
        return <>{props.children(queryResult.data[props.dataAccessor], { selectionMode: "edit" })}</>;
    } else {
        return (
            <React.Fragment>
                {props.selectionMode === "edit" && row && props.children(row, { selectionMode: "edit" })}
                {props.selectionMode === "add" && props.children(row, { selectionMode: "add" })}
            </React.Fragment>
        );
    }
}
