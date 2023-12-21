import { EllipsisTooltip } from "@comet/admin";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/EllipsisTooltip", module).add("DataGrid", () => {
    const words = ["Cursus", "Ridiculus", "Pharetra", "Ligula", "Sem", "Nullam", "Viverra", "Vestibulum", "Vestibulum", "Vestibulum"];

    const getSomeWords = (numberOfWords: number) => {
        return [...words, ...words, ...words].slice(0, numberOfWords).join(" ");
    };

    const gridRows = Array.from({ length: 5 }).map((_, index) => ({
        id: index,
        firstName: getSomeWords(1 * (index + 2)),
        lastName: getSomeWords(3 * (index + 2)),
    }));

    const gridColumns: GridColDef[] = [
        {
            field: "firstName",
            headerName: "First name",
            resizable: true,
            width: 250,
            renderCell: ({ row }) => {
                return <EllipsisTooltip>{row.firstName}</EllipsisTooltip>;
            },
        },
        {
            field: "lastName",
            headerName: "Last name",
            flex: 1,
            renderCell: ({ row }) => {
                return <EllipsisTooltip>{row.lastName}</EllipsisTooltip>;
            },
        },
    ];

    return <DataGrid autoHeight rows={gridRows} columns={gridColumns} disableSelectionOnClick />;
});
