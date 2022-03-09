import { makeStyles, TableCell, Theme } from "@material-ui/core";
import styled from "styled-components";

interface Styles {
    isDragHovered: boolean;
    isMouseHovered: boolean;
    isArchived: boolean;
    isEditable?: boolean;
    isSelected?: boolean;
}

export const useStyles = makeStyles<Theme, Styles>((theme) => ({
    root: {
        scrollMarginTop: 160,
        scrollSnapMarginTop: 160, // Safari
        boxSizing: "border-box",
        display: "grid",

        alignItems: "center",
        position: "relative",
        gridTemplateColumns: "0fr 4fr 1fr 0fr",
        cursor: (props) => (props.isArchived || props.isEditable === false ? "initial" : "pointer"),
        backgroundColor: (props) => {
            if (props.isArchived) {
                return theme.palette.grey[50];
            }
            if (props.isDragHovered) {
                return theme.palette.grey[50];
            }

            if (props.isMouseHovered) {
                return theme.palette.grey[50];
            }
            return "transparent";
        },
        borderLeft: (props) => {
            if (props.isMouseHovered || props.isSelected) {
                return `2px solid ${theme.palette.primary.main}`;
            }

            return "2px solid white";
        },
        borderRight: (props) => {
            if (props.isMouseHovered || props.isSelected) {
                return `2px solid ${theme.palette.primary.main}`;
            }

            return "2px solid white";
        },
        border: (props) => {
            if (props.isSelected) {
                return `2px solid ${theme.palette.primary.main}`;
            }
        },
        borderBottom: (props) => {
            if (props.isSelected) {
                return `none`;
            }
        },
        "&::after": {
            content: '""',
            display: "flex",
            width: "100%",
            height: (props: Styles) => (props.isSelected ? "2px" : 0),
            backgroundColor: theme.palette.primary.main,
            position: "absolute",
            bottom: "-1px",
            zIndex: 2,
        },
        marginBottom: 5,
    },
}));

export const PageTreeCell = styled(TableCell)`
    border: none;
    height: 100%;
    display: flex;
    align-items: center;

    > * {
        position: relative;
        z-index: 11;
    }

    &:last-of-type {
        justify-content: flex-end;
    }
`;

export const RowClickContainer = styled.div`
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
`;

export const AddContainer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    top: 0;
`;
