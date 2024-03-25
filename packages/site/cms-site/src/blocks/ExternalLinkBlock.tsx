"use client";
import * as React from "react";

import { ExternalLinkBlockData } from "../blocks.generated";
import { usePreview } from "../preview/usePreview";
import { sendSitePreviewIFrameMessage } from "../sitePreview/iframebridge/sendSitePreviewIFrameMessage";
import { SitePreviewIFrameMessageType } from "../sitePreview/iframebridge/SitePreviewIFrameMessage";
import { PropsWithData } from "./PropsWithData";

interface ExternalLinkBlockProps extends PropsWithData<ExternalLinkBlockData> {
    children: React.ReactElement;
}

export function ExternalLinkBlock({ data: { targetUrl, openInNewWindow }, children }: ExternalLinkBlockProps): React.ReactElement {
    const preview = usePreview();

    if (preview.previewType === "SitePreview" || preview.previewType === "BlockPreview") {
        const onClick: React.MouseEventHandler = (event) => {
            event.preventDefault();
            if (preview.previewType === "SitePreview") {
                // send link to admin to handle external link
                sendSitePreviewIFrameMessage({
                    cometType: SitePreviewIFrameMessageType.OpenLink,
                    data: { link: { openInNewWindow, targetUrl } },
                });
            }
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
