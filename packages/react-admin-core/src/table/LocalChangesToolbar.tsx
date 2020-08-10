import { Button, CircularProgress, Toolbar, Typography } from "@material-ui/core";
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
                            <Typography variant="button">Speichern</Typography>
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
