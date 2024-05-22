import { GridCellText, GridColDef } from "@comet/admin";
import { faker } from "@faker-js/faker";
import { DataGrid } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/GridCellText", module).add("GridCellText", () => {
    const gridRows = Array.from({ length: 5 }).map((_, index) => ({
        id: index + 1,
        name: faker.name.fullName(),
        occupation: faker.name.jobTitle(),
        company: faker.company.name(),
        email: faker.internet.email(),
    }));

    const gridColumns: GridColDef[] = [
        {
            field: "person",
            headerName: "Person",
            flex: 1,
            renderCell: ({ row }) => <GridCellText primary={row.name} secondary={row.occupation} />,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
    ];

    return <DataGrid autoHeight rows={gridRows} columns={gridColumns} disableSelectionOnClick />;
});
