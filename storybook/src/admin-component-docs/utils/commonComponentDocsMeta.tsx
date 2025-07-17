import { Controls, Description, Primary, Stories } from "@storybook/addon-docs/blocks";
import { type Decorator } from "@storybook/react/*";
import { type Meta } from "@storybook/react-webpack5";
import { useEffect } from "react";

const heightCommunicationDecorator = (): Decorator => {
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

export const commonComponentDocsMeta: Meta = {
    decorators: [heightCommunicationDecorator()],
    parameters: {
        docs: {
            page: () => (
                <>
                    <Description />
                    <Primary />
                    <Controls />
                    <Stories title="More usage examples" includePrimary={false} />
                </>
            ),
        },
    },
};
