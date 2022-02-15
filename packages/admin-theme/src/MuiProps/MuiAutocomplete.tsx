import { Clear } from "@comet/admin-icons";
import { AutocompleteProps } from "@mui/material";
import * as React from "react";

export const getMuiAutocompleteProps = (): Partial<AutocompleteProps<any, any, any, any>> => ({
    clearIcon: <Clear color="action" />,
});
