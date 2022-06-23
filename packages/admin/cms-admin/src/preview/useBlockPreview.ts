import { useStoredState } from "@comet/admin";
import * as React from "react";

import { Device } from "./types";

interface BlockPreviewApi {
    device: Device;
    setDevice: React.Dispatch<React.SetStateAction<Device>>;
    showOnlyVisible: boolean;
    setShowOnlyVisible: React.Dispatch<React.SetStateAction<boolean>>;
    minimized: boolean;
    setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

function useBlockPreview(): BlockPreviewApi {
    const [device, setDevice] = useStoredState<Device>("previewDevice", Device.Responsive);
    const [showOnlyVisible, setShowOnlyVisible] = useStoredState<boolean>("previewShowOnlyVisible", true);
    const [minimized, setMinimized] = useStoredState<boolean>("previewMinimized", false);

    return { device, setDevice, showOnlyVisible, setShowOnlyVisible, minimized, setMinimized };
}

export { BlockPreviewApi, useBlockPreview };
