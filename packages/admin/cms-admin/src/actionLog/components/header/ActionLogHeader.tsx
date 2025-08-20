import { type ThemedComponentBaseProps } from "@comet/admin";
import { Box, type ComponentsOverrides, type Theme, type Typography, useThemeProps } from "@mui/material";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { DbTypeLabel, DbTypeValue, InfoContainer, Root, TitleContainer, TitleTypography, UuidLabel, UuidValue } from "./ActionLogHeader.sc";

export type ActionLogHeaderClassKey =
    | "root"
    | "titleContainer"
    | "infoContainer"
    | "title"
    | "uuidLabel"
    | "uuidValue"
    | "dbTypeLabel"
    | "dbTypeValue";

export interface ActionLogHeaderProps
    extends ThemedComponentBaseProps<{
        root: typeof Box;
        titleContainer: typeof Box;
        infoContainer: typeof Box;
        title: typeof Typography;
        uuidLabel: typeof Typography;
        uuidValue: typeof Typography;
        dbTypeLabel: typeof Typography;
        dbTypeValue: typeof Typography;
    }> {
    action?: ReactNode;
    dbTypes?: string[];
    id: string;
    title: ReactNode;
}

export const ActionLogHeader = (inProps: ActionLogHeaderProps) => {
    const {
        action,
        dbTypes = [],
        id,
        title,
        slotProps,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminActionLogHeader",
    });

    return (
        <Root {...restProps} {...slotProps?.root}>
            <TitleContainer {...slotProps?.titleContainer}>
                <TitleTypography variant="h3" {...slotProps?.title}>
                    {title}
                </TitleTypography>
            </TitleContainer>

            <InfoContainer {...slotProps?.infoContainer}>
                <Box display="flex" gap={2}>
                    <UuidLabel variant="overline" {...slotProps?.uuidLabel}>
                        <FormattedMessage
                            defaultMessage="UUID: {uuid}"
                            id="actionLog.actionLogGrid.uuid"
                            values={{
                                uuid: (
                                    <UuidValue component="span" variant="caption" {...slotProps?.uuidValue}>
                                        {id}
                                    </UuidValue>
                                ),
                            }}
                        />
                    </UuidLabel>

                    {dbTypes.length > 0 && (
                        <DbTypeLabel variant="overline" {...slotProps?.dbTypeLabel}>
                            <FormattedMessage
                                defaultMessage="DB-Type: {uuid}"
                                id="actionLog.actionLogGrid.entity"
                                values={{
                                    uuid: (
                                        <DbTypeValue component="span" variant="caption" {...slotProps?.dbTypeValue}>
                                            {dbTypes.join(", ")}
                                        </DbTypeValue>
                                    ),
                                }}
                            />
                        </DbTypeLabel>
                    )}
                </Box>

                {action}
            </InfoContainer>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminActionLogHeader: ActionLogHeaderProps;
    }

    interface ComponentNameToClassKey {
        CometAdminActionLogHeader: ActionLogHeaderClassKey;
    }

    interface Components {
        CometAdminActionLogHeader?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminActionLogHeader"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminActionLogHeader"];
        };
    }
}
