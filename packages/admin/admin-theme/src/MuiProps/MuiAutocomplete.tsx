import { Clear } from "@comet/admin-icons";
import { AutocompleteProps } from "@material-ui/lab";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMuiAutocompleteProps = (): Partial<AutocompleteProps<any, any, any, any>> => ({
    closeIcon: <Clear color="action" />,
});
