import { styled } from "@mui/material/styles";

export const TitleText = styled("div")`
    font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
    font-size: 18px;
    line-height: 21px;
    color: ${({ theme }) => theme.palette.text.primary};
`;

export const SupportText = styled("div")`
    font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;
