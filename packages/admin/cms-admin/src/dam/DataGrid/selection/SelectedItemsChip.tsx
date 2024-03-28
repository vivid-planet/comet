import { styled } from "@mui/material";

export const SelectedItemsChip = styled("div")`
    display: flex;
    align-items: center;
    height: 24px;
    width: 24px;
    background-color: ${({ theme }) => theme.palette.primary.main};
    margin-left: 10px;
    justify-content: center;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.grey[900]};
`;
