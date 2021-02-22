import { Table } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as numeral from "numeral";
import * as React from "react";

function Story() {
    const tableData = {
        data: [
            { id: 1, name: "User 1" },
            { id: 2, name: "User 2" },
            { id: 3, name: "User 3" },
        ],
        totalCount: 100000,
        pagingInfo: { attachTableRef: () => {} },
    };

    return (
        <Table
            rowName="Users"
            renderTotalCount={getFormattedNumber}
            {...tableData}
            columns={[
                {
                    name: "name",
                    header: "Name",
                },
            ]}
        />
    );
}

function getFormattedNumber(totalCount: number) {
    return numeral(totalCount).format("0,0.00");
}

storiesOf("@comet/admin/table", module).add("Formatted Total Count", () => <Story />);
