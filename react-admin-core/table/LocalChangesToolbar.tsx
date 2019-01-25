import { CircularProgress, Toolbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import { ITableLocalChangesApi } from "@vivid-planet/react-admin-core/TableLocalChanges";
import * as React from "react";

interface IProps {
    tableLocalChangesApi: ITableLocalChangesApi;
    localChangesCount: number;
    updateMutation: any;
    loading: boolean;
}

class LocalChangesToolbar extends React.Component<IProps> {
    public render() {
        return (
            <>
                {this.props.loading && <CircularProgress />}
                {!this.props.loading && (
                    <Toolbar>
                        <Button color="default" onClick={this.handleSaveClick}>
                            Speichern
                            <SaveIcon />
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
export default LocalChangesToolbar;
