import { ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FieldRenderProps } from "react-final-form";

import { ColumnsBlockLayout } from "../createColumnsBlock";

interface Props extends FieldRenderProps<ColumnsBlockLayout> {
    layouts: ColumnsBlockLayout[];
}

export function FinalFormLayoutDisplay({ layouts }: Props) {
    if (layouts.length === 0) return null;

    return (
        <LayoutDisplayContainer>
            {layouts[0].preview}
            <StyledListItemText primary={layouts[0].label} secondary={layouts[0].name} />
        </LayoutDisplayContainer>
    );
}

const LayoutDisplayContainer = styled("div")`
    display: grid;
    grid-template-columns: minmax(80px, 1fr) 2fr;
    column-gap: ${({ theme }) => theme.spacing(2)};
    align-items: center;
    background-color: #ffffff;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    padding: 9px;
    box-sizing: border-box;
`;

const StyledListItemText = styled(ListItemText)`
    margin-top: 0;
    margin-bottom: 0;
`;
