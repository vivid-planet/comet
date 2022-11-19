import { useRouter } from "next/router";
import * as React from "react";

import { previewParamsUrlParamName } from "../preview/constants";
import { PreviewContext, Url } from "../preview/PreviewContext";
import { createPathToPreviewPath, defaultPreviewPath, parsePreviewParams } from "../preview/utils";
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
            searchParams.delete(previewParamsUrlParamName); // Remove __preview query parameter -> that's frontend preview internal

            const message: SitePreviewIFrameLocationMessage = {
                cometType: SitePreviewIFrameMessageType.SitePreviewLocation,
                data: { search: searchParams.toString(), pathname },
            };
            window.parent.postMessage(JSON.stringify(message), "*");
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
            return createPathToPreviewPath({ path, previewPath, previewParams, baseUrl: window.location.origin });
        },
        [previewPath, previewParams],
    );
    const previewPathToPath = React.useCallback(
        (previewUrl: string) => {
            // Parse url
            const { pathname, searchParams } = new URL(previewUrl, window.location.origin);

            // remove previewPath Prefix e.g. '/preview' from path
            const replaceRegex = new RegExp(`^${previewPath}`);

            // remove __preview query parameter from searchParams
            searchParams.delete("__preview");

            // Create new Url
            const newUrl = new URL(pathname.replace(replaceRegex, ""), window.location.origin);

            // copy search params to newUrl
            searchParams.forEach((value, key) => {
                newUrl.searchParams.set(key, value);
            });

            return `${newUrl.pathname}${newUrl.search}`;
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
