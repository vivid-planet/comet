import { Switch, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FunctionComponent } from "react";

interface CollapsibleSwitchButtonHeaderProps {
    checked: boolean;
    title?: React.ReactNode;
}

export const CollapsibleSwitchButtonHeader: FunctionComponent<CollapsibleSwitchButtonHeaderProps> = ({ checked, title }) => {
    return (
        <Root>
            <Typography>{title}</Typography>
            <Switch checked={checked} />
        </Root>
    );
};

const Root = styled("div")`
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
