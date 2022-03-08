import { Button, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import styled from "styled-components";

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

export const StyledButton = styled(Button)`
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 0;
    border-bottom: 2px solid transparent;
    border-left: 1px solid #2e3440;
    color: ${({ theme }) => theme.palette.common.white};
`;

export const CometLogoWrapper = styled.div`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.palette.common.white};
    text-transform: uppercase;
`;

export const CometSiteLinkWrapper = styled.div`
    margin-left: 20px;
    display: flex;
`;

export const CometSiteLink = styled(Link)`
    margin-left: 6px;
    color: ${({ theme }) => theme.palette.common.white};
    text-transform: none;
`;

export const ActionsContainer = styled.div`
    background-color: ${({ theme }) => theme.palette.grey["A400"]};
`;

export const useStyles = makeStyles({
    cometIcon: {
        fontSize: 32,
        height: "auto",
        padding: 6,
    },
});
