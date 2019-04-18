import { Typography } from "@material-ui/core";
import { styled } from "../styled-components";

export const Root = styled.div`
    padding-top: 30px;
    padding-bottom: 30px;
`;

export const Title = styled(Typography)`
    && {
        font-size: 13px;
    }
`;
