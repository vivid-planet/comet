import { Typography } from "@material-ui/core";
import { Cancel, Refresh } from "@material-ui/icons";
import * as React from "react";
import { useForm } from "react-final-form";

import { IField, labelValueFunctions } from "../FilterBar";
import * as sc from "./SideBarForm.sc";

interface ISidebarFormProps {
    handleClose: () => void;
    handleSubmit: () => void;
    sidebarFields: IField[];
    fieldSidebarHeight: number;
}

export const SidebarForm: React.FC<ISidebarFormProps> = ({ handleSubmit, sidebarFields, fieldSidebarHeight, handleClose }) => {
    const filterForm = useForm();
    const { values } = filterForm.getState();

    return (
        <>
            <sc.CancelButton fullWidth={true} startIcon={<Cancel />} type="button" variant="text" onClick={handleClose}>
                <Typography variant={"button"}>{"Abbrechen"}</Typography>
            </sc.CancelButton>
            {sidebarFields.map((field, index) => {
                return (
                    <sc.FieldSidebarWrapper fieldSidebarHeight={fieldSidebarHeight} key={index}>
                        <sc.FilterContainer>
                            <sc.StyledFieldHeaderBox>
                                <Typography variant="subtitle2">{field.label}</Typography>
                                <Typography
                                    display="block"
                                    variant="caption"
                                    style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                                >
                                    {values[field.name] === undefined
                                        ? field.placeHolder
                                        : field.labelValue !== undefined
                                        ? field.labelValue(values[field.name])
                                        : labelValueFunctions[field.type](values[field.name])}
                                </Typography>
                            </sc.StyledFieldHeaderBox>
                            <sc.StyledFieldBox>
                                {React.createElement(field.component)}
                                <sc.ResetButton
                                    startIcon={<Refresh />}
                                    variant="text"
                                    onClick={() => {
                                        filterForm.change(field.name, undefined);
                                        handleSubmit();
                                    }}
                                >
                                    <Typography variant={"button"}>{"Zurücksetzen"}</Typography>
                                </sc.ResetButton>
                            </sc.StyledFieldBox>
                        </sc.FilterContainer>
                    </sc.FieldSidebarWrapper>
                );
            })}
            <sc.SubmitContainer>
                <sc.SubmitButton type="submit" color="primary" variant="contained" onClick={handleSubmit}>
                    {"Übernehmen"}
                </sc.SubmitButton>
            </sc.SubmitContainer>
        </>
    );
};
