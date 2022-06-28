import { styled } from "@mui/material/styles";

export const Tag = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    border-radius: 4px;
    padding: 4px 5px;
    box-sizing: border-box;
    font-size: 12px;
    line-height: 12px;
    color: #242424;
    background-color: ${({ theme }) => theme.palette.grey["100"]}; ;
`;
