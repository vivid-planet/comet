import { Chip, chipClasses, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Toolbar = styled("div")`
    height: 60px;
    background: white;
    display: flex;
    justify-content: right;

    border-bottom: solid 1px;
    border-bottom-color: ${({ theme }) => theme.palette.grey[100]};

    padding: 10px;
`;

export const StyledChip = styled(Chip)`
    display: flex;
    padding: 4px 7px;
    align-items: center;
    gap: 6px;
    height: auto;

    border-radius: 12px;
    background: ${({ theme }) => theme.palette.grey[100]};

    color: black;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 10px;

    .${chipClasses.label} {
        padding: 0;
    }
`;

export const NameInfoWrapper = styled("div")`
    display: flex;
    flex-direction: column;
`;

export const NameInfoTypography = styled(Typography)`
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
`;

export const DisplayedRowsWrapper = styled("div")`
    display: flex;
`;

export const PageLabel = styled("div")`
    flex-grow: 1;
    text-align: right;
`;
