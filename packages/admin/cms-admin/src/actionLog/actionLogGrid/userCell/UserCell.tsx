import { Theme, Typography, useTheme } from "@mui/material";
import { type FunctionComponent } from "react";

import { AvatarStyled, Root } from "./UserCell.sc";

type UserCellProps = {
    name?: string;
    initials?: string;
    avatarColor?: string;
};

const initialsForName = (name?: string) => {
    if (name) {
        const splitName = name.split(" ");
        if (splitName.length > 1) {
            return `${splitName[0].substring(0, 1).toUpperCase()}${splitName[1].substring(0, 1).toUpperCase()}`;
        }
        const dashSplitNames = name.split("-");
        if (dashSplitNames.length > 1) {
            return `${dashSplitNames[0].substring(0, 1).toUpperCase()}${dashSplitNames[1].substring(0, 1).toUpperCase()}`;
        }

        return name.substring(0, 2);
    }

    return undefined;
};

const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

const resolveBackgroundColor = (options: { name?: string; avatarColor?: string; theme: Theme }) => {
    if (options.avatarColor) {
        return options.avatarColor;
    }
    if (options.name) {
        return stringToColor(options.name);
    }
    return options.theme.palette.primary.main;
};

export const UserCell: FunctionComponent<UserCellProps> = ({ name, initials = initialsForName(name), avatarColor }) => {
    const theme = useTheme();

    return (
        <Root>
            <AvatarStyled backgroundColor={resolveBackgroundColor({ name, avatarColor, theme })}>{initials}</AvatarStyled>

            <Typography>{name}</Typography>
        </Root>
    );
};
