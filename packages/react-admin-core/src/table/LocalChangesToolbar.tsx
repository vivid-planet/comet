import { Button, CircularProgress, Toolbar, Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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
                        <Button color="default" onClick={this.handleSaveClick} startIcon={<SaveIcon />}>
                            <Typography variant="button">
                                <FormattedMessage
                                    id="reactAdmin.core.table.localChangesToolbar.save"
                                    defaultMessage="Speichern"
                                    description="Save button"
                                />
                            </Typography>
                        </Button>
                        <FormattedMessage
                            values={{ count: this.props.localChangesCount }}
                            id="reactAdmin.core.table.localChangesToolbar.unsavedItems"
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
