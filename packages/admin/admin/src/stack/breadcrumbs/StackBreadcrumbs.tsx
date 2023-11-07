import { ChevronRight } from "@comet/admin-icons";
import { ComponentsOverrides, Theme, useTheme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { useStackApi } from "../Api";
import { StackBreadcrumbsClassKey, styles } from "./StackBreadcrumbs.styles";
import { getElementOuterWidth, useItemsToRender, useObservedWidth } from "./utils";

export interface StackBreadcrumbsProps {
    separator?: React.ReactNode;
    overflowLinkText?: React.ReactNode;
}

const StackBreadcrumbsComponent = ({
    classes,
    separator,
    overflowLinkText = ". . .",
}: StackBreadcrumbsProps & WithStyles<typeof styles>): React.ReactElement | null => {
    const stackApi = useStackApi();
    const { palette } = useTheme();
    const breadcrumbsRef = React.useRef<HTMLDivElement>(null);
    const containerWidth = useObservedWidth(breadcrumbsRef);
    const [itemWidths, setItemWidths] = React.useState<number[] | undefined>();

    const breadcrumbItems = React.useMemo(() => stackApi?.breadCrumbs ?? [], [stackApi]);
    const combinedTitlesOfBreadcrumbs = breadcrumbItems.map(({ title }) => title).join("");

    React.useEffect(() => {
        setItemWidths(undefined);
    }, [breadcrumbItems?.length, combinedTitlesOfBreadcrumbs]);

    React.useEffect(() => {
        if (breadcrumbItems?.length && !itemWidths?.length) {
            const listItems = breadcrumbsRef.current?.getElementsByClassName(classes.listItem);
            const newItemWidths = listItems ? Object.values(listItems).map((listItem) => getElementOuterWidth(listItem)) : [];
            setItemWidths(newItemWidths);
        }
    }, [breadcrumbItems?.length, combinedTitlesOfBreadcrumbs, itemWidths, classes.listItem]);

    const backButtonUrl = breadcrumbItems.length > 1 ? breadcrumbItems[breadcrumbItems.length - 2].url : undefined;
    const itemsToRender = useItemsToRender(breadcrumbItems, containerWidth ?? 0, classes, itemWidths, overflowLinkText, backButtonUrl);

    if (!breadcrumbItems) return null;

    return (
        <div className={classes.root}>
            <div className={classes.breadcrumbs} ref={breadcrumbsRef}>
                {itemsToRender.map((item, index) => (
                    <div className={classes.listItem} key={index}>
                        {item}
                        {index < itemsToRender.length - 1 && (
                            <div className={classes.separator}>{separator ?? <ChevronRight fontSize="inherit" htmlColor={palette.grey[300]} />}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StackBreadcrumbs = withStyles(styles, { name: "CometAdminStackBreadcrumbs" })(StackBreadcrumbsComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminStackBreadcrumbs: StackBreadcrumbsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminStackBreadcrumbs: Partial<StackBreadcrumbsProps>;
    }

    interface Components {
        CometAdminStackBreadcrumbs?: {
            defaultProps?: ComponentsPropsList["CometAdminStackBreadcrumbs"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminStackBreadcrumbs"];
        };
    }
}
