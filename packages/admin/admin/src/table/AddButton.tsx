import { AddNoCircle } from "@comet/admin-icons";
import { Button } from "@mui/material";
import { Component } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";
import { type ISelectionApi } from "../SelectionApi";

interface IProps {
    selectionApi: ISelectionApi;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export class TableAddButton extends Component<IProps> {
    public render() {
        return (
            <Button onClick={this.handleAddClick} startIcon={<AddNoCircle />}>
                <FormattedMessage {...messages.add} />
            </Button>
        );
    }

    private handleAddClick = () => {
        this.props.selectionApi.handleAdd();
    };
}
