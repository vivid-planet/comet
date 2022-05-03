import { ISelectionApi, Table } from "@comet/admin";
import * as React from "react";

import { UserQueryData } from "./user.gql";

interface ExampleTableProps {
    tableData: {
        data: UserQueryData["users"];
        totalCount: number;
    };
    selectionApi: ISelectionApi;
    selectedId?: string;
}

export const ExampleTable = (props: ExampleTableProps) => {
    return (
        <Table
            {...props.tableData}
            selectionApi={props.selectionApi}
            selectedId={props.selectedId}
            selectable={true}
            columns={[
                {
                    name: "name",
                    header: "Name",
                },
            ]}
        />
    );
};
