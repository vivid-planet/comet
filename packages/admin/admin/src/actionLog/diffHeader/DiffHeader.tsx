import { type Box, type ComponentsOverrides, type Theme, type Typography } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { FormattedDate, FormattedMessage } from "react-intl";

import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { DateTypography, InfoTypography, Root, UserNameTypography, VersionTypography } from "./DiffHeader.sc";

export type DiffHeaderClassKey = "root" | "versionTypography" | "userNameTypography" | "dateTypography" | "infoTypography";

export interface DiffHeaderProps
    extends ThemedComponentBaseProps<{
        root: typeof Box;
        versionTypography: typeof Typography;
        userNameTypography: typeof Typography;
        dateTypography: typeof Typography;
        infoTypography: typeof Typography;
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
        <Root {...slotProps?.root} {...restProps}>
            <VersionTypography {...slotProps?.versionTypography} color="white" variant="subtitle1">
                <FormattedMessage defaultMessage="Version {version}" id="actionLog.actionLogCompare.diffHeader.version" values={{ version }} />
            </VersionTypography>

            <InfoTypography {...slotProps?.infoTypography} color="textSecondary" variant="caption">
                <FormattedMessage
                    defaultMessage="{user} am {date}"
                    id="actionLog.actionLogCompare.diffHeader.userNameAndTime"
                    values={{
                        date: (
                            <DateTypography {...slotProps?.dateTypography} color="textSecondary" variant="overline">
                                <FormattedDate dateStyle="short" timeStyle="short" value={createdAt} />
                            </DateTypography>
                        ),
                        user: (
                            <UserNameTypography {...slotProps?.userNameTypography} color="textSecondary" variant="overline">
                                {userId}
                            </UserNameTypography>
                        ),
                    }}
                />
            </InfoTypography>
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
