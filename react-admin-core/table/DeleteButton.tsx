import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import RemoveIcon from "@material-ui/icons/Remove";
import * as React from "react";
import DeleteMutation from "@vivid-planet/react-admin-core/DeleteMutation";

interface IProps {
    selectedId?: string;
    mutation: any;
}

class DeleteButton extends React.Component<IProps> {
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
                                onClick={ev => {
                                    deleteBrand({ variables: { id: this.props.selectedId! } });
                                }}
                            >
                                Löschen
                                <RemoveIcon />
                            </Button>
                        )}
                    </>
                )}
            </DeleteMutation>
        );
    }
}
export default DeleteButton;
