import { Cookie } from "@comet/admin-icons";
import * as React from "react";

export default {
    title: "stories/Icons/Sizes",
};

export const SmallSizeIcon = () => {
    return <Cookie fontSize="small" />;
};

export const DefaultSizeIcon = () => {
    return <Cookie fontSize="medium" />;
};

export const LargeSizeIcon = () => {
    return <Cookie fontSize="large" />;
};

export const CustomSizeIcon = () => {
    return <Cookie sx={{ fontSize: 100 }} />;
};
