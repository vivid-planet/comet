import { styled } from "@mui/material/styles";

export const Tag = styled("div")<{ type?: "warning" | "error" | "info" | "neutral" }>`
    display: flex;
    justify-content: center;
    gap: 6px;
    align-items: center;
    height: 20px;
    border-radius: 4px;
    margin-left: 10px;
    padding: 4px 5px;
    box-sizing: border-box;
    font-size: 12px;
    line-height: 12px;
    color: ${({ theme, type }) => {
        switch (type) {
            case "error":
                return theme.palette.error.contrastText;
            default:
                return theme.palette.grey[800];
        }
    }};
    background-color: ${({ theme, type }) => {
        switch (type) {
            case "warning":
                return theme.palette.warning.main;
            case "error":
                return theme.palette.error.main;
            case "info":
                return theme.palette.primary.main;
            default:
                return theme.palette.grey["100"];
        }
    }};
`;
