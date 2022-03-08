import { useIFrameBridge } from "@comet/admin-blocks";
import { UserContext } from "@vivid/react-oidc-client";
import * as React from "react";
import useDimensions from "react-cool-dimensions";
import styled, { css } from "styled-components";

import { DeviceFrameDesktop } from "./DeviceFrameDesktop";
import { DeviceFrameMobile } from "./DeviceFrameMobile";
import { DeviceFrameTablet } from "./DeviceFrameTablet";
import { Device } from "./types";

interface DeviceConfig {
    deviceFrame: React.ReactNode;
    outerFrame: {
        width: number;
        height: number;
        padding: string;
    };
}

const devicesConfig: Record<Exclude<Device, Device.Responsive>, DeviceConfig> = {
    [Device.Mobile]: {
        deviceFrame: <DeviceFrameMobile />,
        outerFrame: {
            width: 406,
            height: 763,
            padding: "34px 22px 34px",
        },
    },
    [Device.Tablet]: {
        deviceFrame: <DeviceFrameTablet />,
        outerFrame: {
            width: 1063,
            height: 766,
            padding: "40px 41px 41px 40px",
        },
    },
    [Device.Desktop]: {
        deviceFrame: <DeviceFrameDesktop />,
        outerFrame: {
            width: 1600,
            height: 885,
            padding: "40px 160px 45px",
        },
    },
};

interface Props {
    device: Device;
    initialPageUrl: string;
}

const IFrameViewer = React.forwardRef<HTMLIFrameElement, Props>(({ device, initialPageUrl }, iFrameRef) => {
    const iFrameUrl = new URL(initialPageUrl);
    iFrameUrl.searchParams.append("authProvider", "vivid-planet-idp");

    const deviceConfig = resolveDeviceConfig(device);
    const iFrameBridge = useIFrameBridge();

    const userContext = React.useContext(UserContext);
    React.useEffect(() => {
        function setIFrameServiceWorkerAccessToken() {
            if (!iFrameBridge.iFrameReady) return;
            if (!userContext.getUser().access_token) return;
            iFrameBridge.sendAccessToken(userContext.getUser().access_token);
        }
        setIFrameServiceWorkerAccessToken();
        userContext.userManager.events.addUserLoaded(setIFrameServiceWorkerAccessToken);
        return () => userContext.userManager.events.removeUserLoaded(setIFrameServiceWorkerAccessToken);
    }, [iFrameBridge, userContext]);

    const { observe: containerRef, width, height } = useDimensions<HTMLDivElement | null>();

    const scaleFactor = deviceConfig ? calcScaleFactor(width, height, deviceConfig) : 1;

    return (
        <Root ref={containerRef}>
            <OuterFrame
                // Inline style to prevent device frame disappearing while scaling
                style={{ transform: `scale(${scaleFactor})` }}
                deviceConfig={deviceConfig}
            >
                <IFrame ref={iFrameRef} src={iFrameUrl.toString()} deviceConfig={deviceConfig} />
                {deviceConfig && <DeviceFrameWrapper>{deviceConfig.deviceFrame}</DeviceFrameWrapper>}
            </OuterFrame>
        </Root>
    );
});

function resolveDeviceConfig(device: Device): DeviceConfig | null {
    if (device === Device.Responsive) {
        return null;
    }

    return devicesConfig[device];
}

function calcScaleFactor(width: number, height: number, deviceConfig: DeviceConfig) {
    if (width >= deviceConfig.outerFrame.width + 40 && height >= deviceConfig.outerFrame.height + 40) {
        return 1;
    }

    const scaleX = width / (deviceConfig.outerFrame.width + 40);
    const scaleY = height / (deviceConfig.outerFrame.height + 40);

    return Math.min(scaleX, scaleY, 1);
}

const Root = styled.div`
    position: relative;
    flex: 1;
    background-color: ${({ theme }) => theme.palette.grey[100]};
`;

interface IFrameProps {
    deviceConfig: DeviceConfig | null;
}

const OuterFrame = styled.div<IFrameProps>`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    will-change: transform;

    ${({ deviceConfig }) =>
        deviceConfig !== null &&
        css`
            position: absolute;
            left: calc(50% - ${deviceConfig.outerFrame.width / 2}px);
            top: calc(50% - ${deviceConfig.outerFrame.height / 2}px);
            width: ${deviceConfig.outerFrame.width}px;
            height: ${deviceConfig.outerFrame.height}px;
            padding: ${deviceConfig.outerFrame.padding};
        `}
`;

const IFrame = styled.iframe<IFrameProps>`
    display: block;
    border-style: unset;
    border-width: 1px;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.common.white};
`;

const DeviceFrameWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
`;

export { IFrameViewer };
