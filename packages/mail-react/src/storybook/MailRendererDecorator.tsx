import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml.js";
import { useEffect, useState } from "react";
import { useChannel, useGlobals } from "storybook/preview-api";

import { convertMjmlToHtml } from "../client/renderMailHtml.js";
import { MjmlMailRoot } from "../components/mailRoot/MjmlMailRoot.js";
import type { Theme } from "../theme/themeTypes.js";
import { replaceImagesWithPublicUrl } from "./replaceImagesWithPublicUrl.js";

const RENDER_RESULT_EVENT = "dextinity-mail-render-result";

export function MailRendererDecorator(Story: () => React.JSX.Element, context: { parameters: { mailRoot?: boolean; theme?: Theme } }) {
    const [globals] = useGlobals();
    const emit = useChannel({});

    // Rendered while the decorator runs, because the story may use Storybook hooks, which only work during this call.
    const mjmlString = renderToMjml(
        context.parameters.mailRoot === false ? (
            <Story />
        ) : (
            <MjmlMailRoot theme={context.parameters.theme}>
                <Story />
            </MjmlMailRoot>
        ),
    );

    return (
        <RenderedMail
            mjmlString={mjmlString}
            usePublicImageUrls={Boolean(globals.usePublicImageUrls)}
            onRendered={(renderResult) => emit(RENDER_RESULT_EVENT, renderResult)}
        />
    );
}

interface RenderResult {
    html: string;
    mjmlWarnings: Awaited<ReturnType<typeof convertMjmlToHtml>>["mjmlWarnings"];
    usePublicImageUrls: boolean;
}

function RenderedMail({
    mjmlString,
    usePublicImageUrls,
    onRendered,
}: {
    mjmlString: string;
    usePublicImageUrls: boolean;
    onRendered: (renderResult: RenderResult) => void;
}) {
    const [html, setHtml] = useState<string>();
    const [renderError, setRenderError] = useState<unknown>();

    useEffect(() => {
        let isOutdated = false;

        async function render() {
            let renderResult: Awaited<ReturnType<typeof convertMjmlToHtml>>;
            try {
                renderResult = await convertMjmlToHtml(mjmlString);
            } catch (error) {
                if (!isOutdated) {
                    setRenderError(error);
                }
                return;
            }

            if (isOutdated) {
                return;
            }

            const { html: rawHtml, mjmlWarnings } = renderResult;

            for (const warning of mjmlWarnings) {
                console.warn("MJML warning:", warning);
            }

            const html = usePublicImageUrls ? replaceImagesWithPublicUrl(rawHtml) : rawHtml;
            setHtml(html);
            onRendered({ html, mjmlWarnings, usePublicImageUrls });
        }

        render();

        return () => {
            isOutdated = true;
        };
    }, [mjmlString, usePublicImageUrls, onRendered]);

    if (renderError !== undefined) {
        // Rethrown during render so Storybook shows it like an error thrown by the story.
        throw renderError;
    }

    if (html === undefined) {
        return null;
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
