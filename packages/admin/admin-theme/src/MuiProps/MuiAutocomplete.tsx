import { Clear } from "@comet/admin-icons";
import { AutocompleteProps } from "@material-ui/lab";
import * as React from "react";

export const getMuiAutocompleteProps = (): Partial<AutocompleteProps<any, any, any, any>> => ({
    closeIcon: <Clear color="action" />,
});
