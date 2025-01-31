import { type GridColTypeDef } from "@mui/x-data-grid";
import { FormattedDate } from "react-intl";

export const dataGridDateColumn: GridColTypeDef = {
    type: "date",
    valueGetter: (value) => value && new Date(value),
    renderCell: ({ value }) => value && <FormattedDate value={value} dateStyle="medium" />,
};

export const dataGridDateTimeColumn: GridColTypeDef = {
    type: "dateTime",
    valueGetter: (value) => value && new Date(value),
    renderCell: ({ value }) => value && <FormattedDate value={value} dateStyle="medium" timeStyle="short" />,
};
