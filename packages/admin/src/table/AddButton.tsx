import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ISelectionApi } from "../SelectionApi";

interface IProps {
    selectionApi: ISelectionApi;
}

export class TableAddButton extends React.Component<IProps> {
    public render() {
        return (
            <Button color="default" onClick={this.handleAddClick} startIcon={<AddIcon />}>
                <FormattedMessage id="cometAdmin.generic.add" defaultMessage="Add" />
            </Button>
        );
    }

    private handleAddClick = () => {
        this.props.selectionApi.handleAdd();
    };
}
