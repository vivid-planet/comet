import { PureQueryOptions } from "@apollo/client";
import { Button, IconButton, Typography } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { DeleteMutation } from "../DeleteMutation";

interface IProps {
    selectedId?: string;
    mutation: any;
    icon?: React.ReactNode | null;
    text?: React.ReactNode; // typically a string or a FormattedMessage (intl) is passed
    color?: ButtonProps["color"];
    refetchQueries?: Array<string | PureQueryOptions>;
}

const DeleteMessage = () => <FormattedMessage id="reactAdmin.core.table.deleteButton" defaultMessage="Löschen" description="Delete Button" />;

export class TableDeleteButton extends React.Component<IProps> {
    public render() {
        const { selectedId, mutation, refetchQueries, icon = <DeleteIcon />, text = <DeleteMessage />, color } = this.props;
        const disabled: boolean = !selectedId;

        return (
            <DeleteMutation mutation={mutation} refetchQueries={refetchQueries}>
                {(deleteBrand, { loading }) => {
                    if (loading) return <CircularProgress />;

                    const onClick = this.handleDeleteClick.bind(this, deleteBrand);

                    if (!text && icon) {
                        return (
                            <IconButton onClick={onClick} disabled={disabled} color={color}>
                                {icon}
                            </IconButton>
                        );
                    }

                    return (
                        <Button onClick={onClick} disabled={disabled} color={color} startIcon={icon ? icon : undefined}>
                            <Typography variant="button">{text}</Typography>
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
