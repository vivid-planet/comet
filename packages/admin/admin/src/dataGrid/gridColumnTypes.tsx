import { GridColTypeDef } from "@mui/x-data-grid";
import { IntlShape } from "react-intl";

const date = (intl: IntlShape): GridColTypeDef => ({
    type: "date",
    valueGetter: ({ value }) => value && new Date(value),
    valueFormatter: ({ value }) => value && intl.formatDate(value, { dateStyle: "medium" }),
});

const dateTime = (intl: IntlShape): GridColTypeDef => ({
    type: "dateTime",
    valueGetter: ({ value }) => value && new Date(value),
    valueFormatter: ({ value }) => value && intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }),
});

export const gridColumnTypes = {
    date,
    dateTime,
};
