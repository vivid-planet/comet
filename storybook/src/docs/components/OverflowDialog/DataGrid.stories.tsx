import { OverflowDialog } from "@comet/admin";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/OverflowDialog", module).add("In DataGrid", () => {
    const gridRows = Array.from({ length: 4 }).map((_, index) => ({
        id: index + 1,
        firstName: "Lorem",
        lastName: "Ipsum",
    }));

    const gridColumns: GridColDef[] = [
        {
            field: "firstName",
            headerName: "First name",
            width: 150,
            renderCell: ({ row }) => <Typography>{row.firstName}</Typography>,
        },
        {
            field: "lastName",
            headerName: "Last name",
            width: 150,
            renderCell: ({ row }) => <Typography>{row.lastName}</Typography>,
        },
        {
            field: "lotsOfText",
            headerName: "Lots of text",
            flex: 1,
            renderCell: () => {
                const paragraphsCount = 10;
                return (
                    <OverflowDialog>
                        <Typography fontWeight={600} gutterBottom>
                            Ornare Inceptos Egestas Bibendum
                        </Typography>
                        {Array.from({ length: paragraphsCount }).map((_, index) => (
                            <Typography key={index} variant="body2" gutterBottom={index !== paragraphsCount - 1}>
                                Curabitur blandit tempus porttitor. Nullam id dolor id nibh ultricies vehicula ut id elit. Cras mattis consectetur
                                purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa
                                justo sit amet risus.
                            </Typography>
                        ))}
                    </OverflowDialog>
                );
            },
        },
    ];

    return <DataGrid autoHeight rows={gridRows} columns={gridColumns} rowHeight={100} disableSelectionOnClick />;
});
