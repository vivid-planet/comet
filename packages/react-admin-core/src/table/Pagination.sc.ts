import { ButtonBase } from "@material-ui/core";
import { Input } from "@vivid-planet/react-admin-form";
import styled from "styled-components";

export const Button = styled(ButtonBase)`
    && {
        padding: 16px;

        :hover {
            background-color: ${props => props.theme.palette.grey["100"]};
        }
    }
`;

export const InputField = styled(Input)`
    && {
        width: 60px;
        padding-left: 10px;
        padding-right: 5px;
        margin: 0 10px;
        border: 1px solid grey;
        border-radius: 9px;
        text-align: center;
    }
`;

export const PageInputWrapper = styled.div`
    && {
        display: inline-block;
    }
`;
