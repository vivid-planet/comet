import { Toolbar } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { SaveButton } from "../common/buttons/save/SaveButton";
import { Loading } from "../common/Loading";
import { ITableLocalChangesApi } from "./TableLocalChanges";

interface Props {
    tableLocalChangesApi: ITableLocalChangesApi;
    localChangesCount: number;
    updateMutation: any;
    loading: boolean;
}

export const TableLocalChangesToolbar = ({ tableLocalChangesApi, localChangesCount, updateMutation, loading }: Props) => {
    const handleSaveClick = () => {
        tableLocalChangesApi.submitLocalDataChanges();
    };

    return (
        <Toolbar>
            {loading ? (
                <Loading behavior="fillParent" />
            ) : (
                <>
                    <SaveButton onClick={handleSaveClick} />
                    <FormattedMessage
                        values={{ count: localChangesCount }}
                        id="comet.table.localChangesToolbar.unsavedItems"
                        defaultMessage="{count, plural, =0 {No unsaved changes} one {# unsaved change} other {# unsaved changes}}"
                    />
                </>
            )}
        </Toolbar>
    );
};
