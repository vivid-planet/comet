// eslint-disable-next-line no-restricted-imports
import { useRouter } from "next/router";
import * as React from "react";

import { PreviewContext, Url } from "../preview/PreviewContext";
import { createPathToPreviewPath, defaultPreviewPath, parsePreviewParams } from "../preview/utils";
import { sendSitePreviewIFrameMessage } from "./iframebridge/sendSitePreviewIFrameMessage";
import { SitePreviewIFrameLocationMessage, SitePreviewIFrameMessageType } from "./iframebridge/SitePreviewIFrameMessage";

interface Props {
    previewPath?: string;
}

export const SitePreviewProvider: React.FunctionComponent<Props> = ({ children, previewPath = defaultPreviewPath }) => {
    const router = useRouter();

    React.useEffect(() => {
        function sendUpstreamMessage() {
            const url = new URL(router.asPath, window.location.origin);
            const { pathname, searchParams } = url;
            searchParams.delete("__preview"); // Remove __preview query parameter -> that's frontend preview internal

            const message: SitePreviewIFrameLocationMessage = {
                cometType: SitePreviewIFrameMessageType.SitePreviewLocation,
                data: { search: searchParams.toString(), pathname },
            };
            sendSitePreviewIFrameMessage(message);
        }
        sendUpstreamMessage();
        window.addEventListener("load", sendUpstreamMessage);
        () => {
            window.removeEventListener("load", sendUpstreamMessage);
        };
    }, [router]);

    const previewParams = parsePreviewParams(router.query);

    // maps the original-path to the preview-path
    const pathToPreviewPath = React.useCallback(
        (path: Url) => {
            return createPathToPreviewPath({ path, previewPath, previewParams });
        },
        [previewPath, previewParams],
    );
    const previewPathToPath = React.useCallback(
        (previewUrl: string) => {
            // Parse url
            const [pathname, search] = previewUrl.split("?");

            // remove previewPath Prefix e.g. '/preview' from path
            const newPathname = pathname.replace(new RegExp(`^${previewPath}`), "");

            // remove __preview query parameter from searchParams
            const newSearchParams = new URLSearchParams(search);
            newSearchParams.delete("__preview");
            const newSearch = newSearchParams.toString();

            return `${newPathname.length === 0 ? "/" : newPathname}${newSearch.length === 0 ? "" : `?${newSearch}`}`;
        },
        [previewPath],
    );
    return (
        <PreviewContext.Provider
            value={{
                previewType: "SitePreview",
                showPreviewSkeletons: false,
                pathToPreviewPath,
                previewPathToPath,
            }}
        >
            {children}
        </PreviewContext.Provider>
    );
};
