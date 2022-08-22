import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";
import { ISelectionApi } from "../SelectionApi";

interface IProps {
    selectionApi: ISelectionApi;
}

export class TableAddButton extends React.Component<IProps> {
    public render() {
        return (
            <Button onClick={this.handleAddClick} startIcon={<AddIcon />}>
                <FormattedMessage {...messages.add} />
            </Button>
        );
    }

    private handleAddClick = () => {
        this.props.selectionApi.handleAdd();
    };
}
