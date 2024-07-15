import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

interface ContainerProps {
    children: React.ReactElement<ItemProps>[];
}

interface ItemProps {
    width: number;
}

export function ColumnsLayoutPreview({ children }: ContainerProps): React.ReactElement {
    const columns = React.Children.map(children, (child) => `${child.props.width}fr`).join(" ");
    return <Root columns={columns}>{children}</Root>;
}

const Root = styled("div")<{ columns: string }>`
    display: grid;
    grid-template-columns: ${({ columns }) => columns};
    box-shadow: ${({ theme }) => theme.shadows[1]};
`;

export const ColumnsLayoutPreviewSpacing = styled("span")<ItemProps>`
    height: 40px;
    background-color: #fff;
`;

const RootContent = styled(ColumnsLayoutPreviewSpacing)`
    background-color: ${({ theme }) => theme.palette.grey[100]};
    color: ${({ theme }) => theme.palette.background.paper};
    display: flex;
    justify-content: center;
    align-items: center;
`;

export function ColumnsLayoutPreviewContent({ width }: ItemProps): React.ReactElement<ItemProps> {
    return <RootContent width={width}>{width > 3 ? <Typography variant="subtitle1">{width}</Typography> : null}</RootContent>;
}
