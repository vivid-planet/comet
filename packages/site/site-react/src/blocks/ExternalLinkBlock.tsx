"use client";

import { type AnchorHTMLAttributes, cloneElement, type MouseEventHandler, type ReactElement } from "react";

import { type ExternalLinkBlockData } from "../blocks.generated";
import { usePreview } from "../preview/usePreview";
import { sendSitePreviewIFrameMessage } from "../sitePreview/iframebridge/sendSitePreviewIFrameMessage";
import { SitePreviewIFrameMessageType } from "../sitePreview/iframebridge/SitePreviewIFrameMessage";
import { type PropsWithData } from "./PropsWithData";

interface ExternalLinkBlockProps extends PropsWithData<ExternalLinkBlockData>, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    children: ReactElement;
    legacyBehavior?: boolean;
}

export function ExternalLinkBlock({ data: { targetUrl, openInNewWindow }, children, legacyBehavior, ...anchorProps }: ExternalLinkBlockProps) {
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
            return cloneElement(children, { ...anchorProps, href: "#", onClick });
        }

        return (
            <a {...anchorProps} href="#" onClick={onClick}>
                {children}
            </a>
        );
    } else {
        if (!targetUrl) {
            if (legacyBehavior) {
                return children;
            }

            return <span className={anchorProps.className}>{children}</span>;
        }

        const href = targetUrl;
        const target = openInNewWindow ? "_blank" : anchorProps.target;

        if (legacyBehavior) {
            return cloneElement(children, { ...anchorProps, href, target });
        }

        return (
            <a {...anchorProps} href={href} target={target}>
                {children}
            </a>
        );
    }
}
