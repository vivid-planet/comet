import { CircularProgress, Toolbar } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { SaveButton } from "../common/buttons/save/SaveButton";
import { ITableLocalChangesApi } from "./TableLocalChanges";

interface IProps {
    tableLocalChangesApi: ITableLocalChangesApi;
    localChangesCount: number;
    updateMutation: any;
    loading: boolean;
}

export class TableLocalChangesToolbar extends React.Component<IProps> {
    public render() {
        return (
            <>
                {this.props.loading && <CircularProgress />}
                {!this.props.loading && (
                    <Toolbar>
                        <SaveButton onClick={this.handleSaveClick} />
                        <FormattedMessage
                            values={{ count: this.props.localChangesCount }}
                            id="cometAdmin.table.localChangesToolbar.unsavedItems"
                            defaultMessage="{count, plural, =0 {No unsaved changes} one {# unsaved change} other {# unsaved changes}}"
                        />
                    </Toolbar>
                )}
            </>
        );
    }

    private handleSaveClick = () => {
        this.props.tableLocalChangesApi.submitLocalDataChanges();
    };
}
