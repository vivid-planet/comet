import { Box } from "@mui/material";
import { Decorator } from "@storybook/react";
import { useEffect } from "react";

import { stackRouteDecorator } from "../helpers/storyDecorators";
import { storyRouterDecorator } from "../story-router.decorator";

export const createComponentDocsStory = (componentName: string) => {
    return {
        title: `Component Docs/${componentName}`,
        tags: ["!autodocs"],
        parameters: {
            layout: "fullscreen",
        },
        decorators: [componentDocsDecorator(), heightCommunicationDecorator(), stackRouteDecorator(), storyRouterDecorator()],
    };
};

const componentDocsDecorator = (): Decorator => {
    return (Story) => {
        return (
            <Box p={4}>
                <Story />
            </Box>
        );
    };
};

const heightCommunicationDecorator = (): Decorator => {
    return (Story) => {
        useEffect(() => {
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
