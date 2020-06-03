import { Button, IconButton } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import * as React from "react";
import { DeleteMutation } from "../DeleteMutation";

interface IProps {
    selectedId?: string;
    mutation: any;
    icon?: React.ReactNode | null;
    text?: string;
    color?: ButtonProps["color"];
}

export class TableDeleteButton extends React.Component<IProps> {
    public render() {
        const { selectedId, mutation, icon = <DeleteIcon />, text = "Löschen", color } = this.props;
        const disabled: boolean = !selectedId;

        return (
            <DeleteMutation mutation={mutation}>
                {(deleteBrand, { loading }) => {
                    if (loading) return <CircularProgress />;

                    const onClick = this.handleDeleteClick.bind(this, deleteBrand);

                    if (!text.length && icon) {
                        return <IconButton color={color}>{icon}</IconButton>;
                    }

                    return (
                        <Button onClick={onClick} disabled={disabled} color={color} startIcon={icon ? icon : undefined}>
                            {text}
                        </Button>
                    );
                }}
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
