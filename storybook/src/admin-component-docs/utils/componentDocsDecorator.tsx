import { type Decorator } from "@storybook/react/*";
import { useEffect } from "react";

export const componentDocsDecorator = (): Decorator => {
    return (Story) => {
        useEffect(() => {
            const isEmbeddedInDocs = window.location.search.includes("isEmbeddedInDocs=true");
            const sbdocs = document.querySelector(".sbdocs");

            if (isEmbeddedInDocs && sbdocs instanceof HTMLElement) {
                sbdocs.classList.add("isEmbeddedInDocs");
            }

            const sendHeightToParent = () => {
                if (window.parent !== window) {
                    window.parent.postMessage({ type: "document-height", height: document.body.scrollHeight }, "*");
                }
            };

            sendHeightToParent();

            const resizeObserver = new ResizeObserver(sendHeightToParent);
            resizeObserver.observe(document.body);

            const mutationObserver = new MutationObserver(sendHeightToParent);
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
            });

            return () => {
                resizeObserver.disconnect();
                mutationObserver.disconnect();
            };
        }, []);

        return <Story />;
    };
};
