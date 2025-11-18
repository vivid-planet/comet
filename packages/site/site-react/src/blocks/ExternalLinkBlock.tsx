"use client";

import { cloneElement, type MouseEventHandler, type ReactElement } from "react";

import { type ExternalLinkBlockData } from "../blocks.generated";
import { usePreview } from "../preview/usePreview";
import { sendSitePreviewIFrameMessage } from "../sitePreview/iframebridge/sendSitePreviewIFrameMessage";
import { SitePreviewIFrameMessageType } from "../sitePreview/iframebridge/SitePreviewIFrameMessage";
import { type PropsWithData } from "./PropsWithData";

interface ExternalLinkBlockProps extends PropsWithData<ExternalLinkBlockData> {
    children: ReactElement;
    title?: string;
    className?: string;
    legacyBehavior?: boolean;
}

export function ExternalLinkBlock({ data: { targetUrl, openInNewWindow }, children, title, className, legacyBehavior }: ExternalLinkBlockProps) {
    const preview = usePreview();

    if (preview.previewType === "SitePreview" || preview.previewType === "BlockPreview") {
        const onClick: MouseEventHandler = (event) => {
            event.preventDefault();
            if (preview.previewType === "SitePreview") {
                // send link to admin to handle external link
                sendSitePreviewIFrameMessage({
                    cometType: SitePreviewIFrameMessageType.OpenLink,
                    data: { link: { openInNewWindow, targetUrl } },
                });
            }
        };

        if (legacyBehavior) {
            return cloneElement(children, { href: "#", onClick, title });
        }

        return (
            <a href="#" onClick={onClick} title={title} className={className}>
                {children}
            </a>
        );
    } else {
        if (!targetUrl) {
            if (legacyBehavior) {
                return children;
            }

            return <span className={className}>{children}</span>;
        }

        const href = targetUrl;
        const target = openInNewWindow ? "_blank" : undefined;

        if (legacyBehavior) {
            return cloneElement(children, { href, target, title });
        }

        return (
            <a href={href} target={target} title={title} className={className}>
                {children}
            </a>
        );
    }
}
