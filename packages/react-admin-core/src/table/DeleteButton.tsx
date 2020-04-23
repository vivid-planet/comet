import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import * as React from "react";
import { DeleteMutation } from "../DeleteMutation";

interface IProps {
    selectedId?: string;
    mutation: any;
}

export class TableDeleteButton extends React.Component<IProps> {
    public render() {
        return (
            <DeleteMutation mutation={this.props.mutation}>
                {(deleteBrand, { loading }) => (
                    <>
                        {loading && <CircularProgress />}
                        {!loading && (
                            <Button
                                color="default"
                                disabled={!this.props.selectedId}
                                onClick={this.handleDeleteClick.bind(this, deleteBrand)}
                                startIcon={<DeleteIcon />}
                            >
                                Löschen
                            </Button>
                        )}
                    </>
                )}
            </DeleteMutation>
        );
    }

    private handleDeleteClick = (
        deleteBrand: (options: {
            variables: {
                id: string;
            };
        }) => void,
    ) => {
        deleteBrand({ variables: { id: this.props.selectedId! } });
    };
}
