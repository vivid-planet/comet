import { makeStyles } from "@material-ui/core";
import styled from "styled-components";

export const useStyles = makeStyles(() => ({
    root: {
        minHeight: 51,
        display: "flex",
        alignItems: "center",
    },
    selectAllFromControlLabel: {
        padding: "15px 10px 15px 7px",
        display: "flex",
        alignItems: "center",
    },
    centerContainer: {
        display: "flex",
        alignItems: "center",
    },
}));
export const Separator = styled.div`
    display: inline-flex;
    width: 1px;
    height: 26px;
    background-color: ${(props) => props.theme.palette.grey["200"]};
    margin-left: 20px;
    margin-right: 20px;
`;
