import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";
import ISelectionApi from "../SelectionApi";

interface IProps {
    selectionApi: ISelectionApi;
}

class AddButton extends React.Component<IProps> {
    public render() {
        return (
            <Button color="default" onClick={this.handleAddClick}>
                Hinzufügen
                <AddIcon />
            </Button>
        );
    }

    private handleAddClick = () => {
        this.props.selectionApi.handleAdd();
    };
}
export default AddButton;
