import { Link } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled("div")`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

export const SiteInformation = styled("div")`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.palette.common.white};
    padding: 0 6px;
    gap: 20px;
`;

export const LogoWrapper = styled("div")`
    display: inline-flex;
    align-items: center;
    gap: 6px;
`;

export const SiteLinkWrapper = styled("div")`
    display: inline-flex;
    align-items: center;
    gap: 6px;
`;

export const SiteLink = styled(Link)`
    color: ${({ theme }) => theme.palette.common.white};
    text-decoration-color: currentColor;
`;

export const ActionsContainer = styled("div")`
    background-color: ${({ theme }) => theme.palette.grey["A400"]};
`;
