import { PureQueryOptions } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
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

const DeleteMessage = () => <FormattedMessage id="cometAdmin.generic.delete" defaultMessage="Delete" />;

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
                            <IconButton onClick={onClick} disabled={disabled} color={color} size="large">
                                {icon}
                            </IconButton>
                        );
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
