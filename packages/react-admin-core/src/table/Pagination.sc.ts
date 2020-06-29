import { ButtonBase } from "@material-ui/core";
import styled from "styled-components";

export const Button = styled(ButtonBase)`
    && {
        padding: 16px;

        :hover {
            background-color: ${props => props.theme.palette.grey["100"]};
        }
    }
`;
