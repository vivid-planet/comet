import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import styled from "styled-components";

interface IProps {
    selectionMode: "edit" | "add";
    selectedId?: string;
    rows?: Array<{ id: string | number }>;
    query?: any;
    dataAccessor?: string;
    children: (data: any, options: { selectionMode: "edit" | "add" }) => React.ReactNode;
}
const ProgressContainer = styled.div`
    padding-top: 30px;
    display: flex;
    justify-content: center;
`;

export class Selected extends React.Component<IProps> {
    public render() {
        let row;
        if (this.props.rows) {
            row = this.props.rows.find(i => String(i.id) === String(this.props.selectedId)); // compare as strings as selectedId might come from url
        }
        // console.log(this.props.selectionMode, this.props.selectedId, row, this.props.rows);
        if (this.props.selectionMode === "edit" && !row) {
            return (
                <Query query={this.props.query} variables={{ id: this.props.selectedId }}>
                    {(queryResult: QueryResult) => {
                        if (queryResult.loading || !queryResult.data) {
                            return (
                                <ProgressContainer>
                                    <CircularProgress />
                                </ProgressContainer>
                            );
                        }
                        if (queryResult.error) return <p>Error :( {queryResult.error.toString()}</p>;
                        if (!this.props.dataAccessor) {
                            throw new Error("dataChild prop is required");
                        }
                        return this.props.children(queryResult.data[this.props.dataAccessor], { selectionMode: "edit" });
                    }}
                </Query>
            );
        } else {
            return (
                <React.Fragment>
                    {this.props.selectionMode === "edit" && row && this.props.children(row, { selectionMode: "edit" })}
                    {this.props.selectionMode === "add" && this.props.children(row, { selectionMode: "add" })}
                </React.Fragment>
            );
        }
    }
}
