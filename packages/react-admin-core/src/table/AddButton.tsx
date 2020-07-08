import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";
import { ISelectionApi } from "../SelectionApi";
import { FormattedMessage } from "react-intl";

interface IProps {
    selectionApi: ISelectionApi;
}

export class TableAddButton extends React.Component<IProps> {
    public render() {
        return (
            <Button color="default" onClick={this.handleAddClick} startIcon={<AddIcon />}>
                <FormattedMessage id="reactAdmin.core.table.addButton" defaultMessage="Hinzufügen" description="Hinzufügen Button" />
            </Button>
        );
    }

    private handleAddClick = () => {
        this.props.selectionApi.handleAdd();
    };
}
