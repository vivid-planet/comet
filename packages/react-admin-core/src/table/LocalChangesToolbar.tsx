import { CircularProgress, Toolbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import * as React from "react";
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
                            Speichern
                        </Button>
                        {this.props.localChangesCount} unsaved change(s)
                    </Toolbar>
                )}
            </>
        );
    }

    private handleSaveClick = () => {
        this.props.tableLocalChangesApi.submitLocalDataChanges();
    };
}
