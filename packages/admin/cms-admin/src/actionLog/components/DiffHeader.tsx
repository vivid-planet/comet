import { type ThemedComponentBaseProps } from "@comet/admin";
import { type Box, type ComponentsOverrides, type Theme, type Typography } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { FormattedDate, FormattedMessage } from "react-intl";

import { Date, Info, Root, UserName, Version } from "./DiffHeader.sc";

export type DiffHeaderClassKey = "root" | "version" | "userName" | "date" | "info";

export interface DiffHeaderProps
    extends ThemedComponentBaseProps<{
        root: typeof Box;
        version: typeof Typography;
        userName: typeof Typography;
        date: typeof Typography;
        info: typeof Typography;
    }> {
    createdAt?: string;
    userId?: string;
    version?: number;
}

export const DiffHeader = (inProps: DiffHeaderProps) => {
    const { createdAt, userId, version, slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminDiffHeader",
    });

    return (
        <Root {...restProps} {...slotProps?.root}>
            <Version color="white" variant="subtitle1" {...slotProps?.version}>
                <FormattedMessage defaultMessage="Version {version}" id="actionLog.actionLogCompare.diffHeader.version" values={{ version }} />
            </Version>

            <Info color="textSecondary" variant="caption" {...slotProps?.info}>
                <FormattedMessage
                    defaultMessage="{user} on {date}"
                    id="actionLog.actionLogCompare.diffHeader.userNameAndTime"
                    values={{
                        date: (
                            <Date color="textSecondary" variant="overline" {...slotProps?.date}>
                                <FormattedDate dateStyle="short" timeStyle="short" value={createdAt} />
                            </Date>
                        ),
                        user: (
                            <UserName color="textSecondary" variant="overline" {...slotProps?.userName}>
                                {userId}
                            </UserName>
                        ),
                    }}
                />
            </Info>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDiffHeader: DiffHeaderProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDiffHeader: DiffHeaderClassKey;
    }

    interface Components {
        CometAdminDiffHeader?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDiffHeader"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDiffHeader"];
        };
    }
}
