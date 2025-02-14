import { Box, css } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Root = styled(Box)`
    position: relative;
`;

export const Children = styled("div")`
    position: relative;
    z-index: 1;
`;

interface HoverProps {
    isHovered: boolean;
}

export const Hover = styled("div", { shouldForwardProp: (prop) => prop !== "isHovered" })<HoverProps>`
    ${(props) => {
        if (props.isHovered) {
            return css`
                border: solid ${props.theme.palette.primary.main} 1px;
                :after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background-color: #57b0eb;
                    opacity: 0.25;
                }
            `;
        }
    }}

    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    bottom: 1px;
`;
