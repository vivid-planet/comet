"use client";

<<<<<<< HEAD
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type MouseEventHandler, type ReactElement } from "react";
=======
import { type AnchorHTMLAttributes, cloneElement, type MouseEventHandler, type ReactElement } from "react";
>>>>>>> main

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
<<<<<<< HEAD
            return cloneElement(
                children as ReactElement<
                    Pick<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "href" | "onClick" | "target" | "title">
                >,
                { href: "#", onClick, title },
            );
=======
            return cloneElement(children, { ...anchorProps, href: "#", onClick });
>>>>>>> main
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
<<<<<<< HEAD
            return cloneElement(
                children as ReactElement<
                    Pick<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "href" | "onClick" | "target" | "title">
                >,
                { href, target, title },
            );
=======
            return cloneElement(children, { ...anchorProps, href, target });
>>>>>>> main
        }

        return (
            <a {...anchorProps} href={href} target={target}>
                {children}
            </a>
        );
    }
}
