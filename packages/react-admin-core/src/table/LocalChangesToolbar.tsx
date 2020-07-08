import { CircularProgress, Toolbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import * as React from "react";
import { ITableLocalChangesApi } from "./TableLocalChanges";
import { FormattedMessage } from "react-intl";

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
                            <FormattedMessage
                                id="reactAdmin.core.table.localChangesToolbar.save"
                                defaultMessage="Speichern"
                                description="Speichern Button"
                            />
                        </Button>
                        <FormattedMessage
                            values={{ count: this.props.localChangesCount }}
                            id="reactAdmin.core.table.localChangesToolbar.unsavedItems"
                            defaultMessage="{count, plural, =0 {no unsaved changes} one {# unsaved change} other {# unsaved changes}}"
                            description="Info about unsaved items in local changes"
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
