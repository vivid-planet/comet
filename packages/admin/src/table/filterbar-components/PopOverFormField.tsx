import { Box, Typography } from "@material-ui/core";
import { Cancel, Refresh } from "@material-ui/icons";
import * as React from "react";
import { FieldRenderProps, useForm } from "react-final-form";

import { IField, labelValueFunctions } from "../FilterBar";
import * as sc from "./PopOverFormField.sc";

interface IFormFieldProps extends FieldRenderProps<any> {
    field: IField;
}

export const PopOverFormField: React.FC<IFormFieldProps> = ({ field, handleSubmit }) => {
    const filterForm = useForm();
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { values } = filterForm.getState();

    return (
        <sc.FilterContainer>
            <sc.StyledBox onClick={handleClick}>
                <Typography variant="subtitle2">{field.label}</Typography>
                <Typography display="block" variant="caption" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {values[field.name] === undefined
                        ? field.placeHolder
                        : field.labelValue !== undefined
                        ? field.labelValue(values[field.name])
                        : labelValueFunctions[field.type](values[field.name])}
                </Typography>
            </sc.StyledBox>
            <sc.StyledPopover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: -23,
                    horizontal: 65,
                }}
                PaperProps={{ square: true }}
                classes={{
                    paper: "paper",
                }}
            >
                <sc.PopoverContentContainer>
                    <Box style={{ minWidth: 300 }}>
                        {React.createElement(field.component)}
                        <sc.ButtonsContainer>
                            <sc.SubmitContainer>
                                <sc.SubmitButton
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        handleSubmit();
                                        handleClose();
                                    }}
                                >
                                    {"Übernehmen"}
                                </sc.SubmitButton>
                            </sc.SubmitContainer>
                            <sc.ResetCloseContainer>
                                <sc.ResetButton
                                    startIcon={<Refresh />}
                                    type="reset"
                                    variant="text"
                                    onClick={() => {
                                        filterForm.change(field.name, undefined);
                                        handleSubmit();
                                        handleClose();
                                    }}
                                >
                                    <Typography variant={"button"}>{"Zurücksetzen"}</Typography>
                                </sc.ResetButton>
                                <sc.CancelButton startIcon={<Cancel />} type="button" variant="text" onClick={handleClose}>
                                    <Typography variant={"button"}>{"Abbrechen"}</Typography>
                                </sc.CancelButton>
                            </sc.ResetCloseContainer>
                        </sc.ButtonsContainer>
                    </Box>
                </sc.PopoverContentContainer>
            </sc.StyledPopover>
        </sc.FilterContainer>
    );
};
