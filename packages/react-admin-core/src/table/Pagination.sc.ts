import { ButtonBase } from "@material-ui/core";
import { styled } from "@vivid-planet/react-admin-mui";

export const Spacer = styled.div`
    flex: 1 1 100%;
`;

export const Button = styled(ButtonBase)`
    && {
        padding: 16px;
        :hover {
            background-color: ${props => props.theme.palette.grey["100"]};
        }
    }
`;
