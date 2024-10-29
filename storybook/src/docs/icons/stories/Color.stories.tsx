import { ThreeDotSaving } from "@comet/admin-icons";
import * as React from "react";

export default {
    title: "stories/Icons/Colors",
};

export const DefaultColor = () => {
    return <ThreeDotSaving />;
};

export const PrimaryColor = () => {
    return <ThreeDotSaving color="primary" />;
};

export const SecondaryColor = () => {
    return <ThreeDotSaving color="secondary" />;
};

export const ErrorColor = () => {
    return <ThreeDotSaving color="error" />;
};

export const DisabledColor = () => {
    return <ThreeDotSaving color="disabled" />;
};

export const ActionColor = () => {
    return <ThreeDotSaving color="action" />;
};

export const CustomColor = () => {
    return <ThreeDotSaving htmlColor="#ff00ff" />;
};
