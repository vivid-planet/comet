import { Typography } from "@material-ui/core";
import * as React from "react";

import { useStackApi } from "../../../stack";
import { ToolbarItem } from "../titleitem/ToolbarItem";

interface ToolbarTitleItemProps {
    title?: React.ReactNode;
}
const ToolbarTitleItem: React.FunctionComponent<ToolbarTitleItemProps> = ({ title }) => {
    const stackApi = useStackApi();

    return (
        <>
            {title ? (
                <ToolbarItem>{title}</ToolbarItem>
            ) : (
                <ToolbarItem>
                    {/* TODO: Is there any better way to get the page title?*/}
                    <Typography variant={"h4"}>
                        {stackApi?.breadCrumbs != null &&
                            stackApi.breadCrumbs.length > 0 &&
                            stackApi.breadCrumbs[stackApi?.breadCrumbs.length - 1].title}
                    </Typography>
                </ToolbarItem>
            )}
        </>
    );
};

export { ToolbarTitleItem };
