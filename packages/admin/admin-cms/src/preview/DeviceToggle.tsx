import { DeviceDesktop, DevicePhone, DeviceResponsive, DeviceTablet } from "@comet/admin-icons";
import { ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import styled from "styled-components";

import { ToggleButton } from "./ToggleButton";
import { Device } from "./types";

interface Props {
    device: Device;
    onChange: (device: Device) => void;
}

function DeviceToggle({ device, onChange }: Props): React.ReactElement {
    const handleDeviceChange = (event: React.MouseEvent<HTMLElement>, newDevice: Device | null) => {
        if (newDevice === null) {
            // Disable deselection
            return;
        }

        onChange(newDevice);
    };

    return (
        <Root value={device} onChange={handleDeviceChange} exclusive>
            <ToggleButton value={Device.Responsive}>
                <DeviceResponsive />
            </ToggleButton>
            <ToggleButton value={Device.Mobile}>
                <DevicePhone />
            </ToggleButton>
            <ToggleButton value={Device.Tablet}>
                <DeviceTablet />
            </ToggleButton>
            <ToggleButton value={Device.Desktop}>
                <DeviceDesktop />
            </ToggleButton>
        </Root>
    );
}

const Root = styled(ToggleButtonGroup)`
    border-radius: 0;
    border-right: 1px solid #2e3440;
    border-left: 1px solid #2e3440;
    background-color: transparent;
`;

export { DeviceToggle };
