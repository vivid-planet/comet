import * as React from "react";

import { ExternalLinkBlockData } from "../blocks.generated";
import { IFrameMessageType } from "../iframebridge/IFrameMessage";
import { useIFrameBridge } from "../iframebridge/useIFrameBridge";
import { PropsWithData } from "./PropsWithData";

interface ExternalLinkBlockProps extends PropsWithData<ExternalLinkBlockData> {
    children: React.ReactElement;
}

export function ExternalLinkBlock({ data: { targetUrl, openInNewWindow }, children }: ExternalLinkBlockProps): React.ReactElement {
    const iframe = useIFrameBridge();

    if (iframe.hasBridge) {
        // send link to admin to handle external link
        const onClick: React.MouseEventHandler = (event) => {
            event.preventDefault();
            iframe.sendMessage({
                cometType: IFrameMessageType.OpenLink,
                data: { link: { openInNewWindow, targetUrl } },
            });
        };

        return React.cloneElement(children, { href: "#", onClick });
    } else {
        if (!targetUrl) {
            return children;
        }

        const childProps = {
            href: targetUrl ? targetUrl : "#",
            target: openInNewWindow ? "_blank" : undefined,
        };

        return React.cloneElement(children, childProps);
    }
}
