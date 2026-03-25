import { type ReactNode, useEffect } from "react";
import { addons } from "storybook/preview-api";

import { renderMailHtml } from "../client/index.js";
import { MjmlMailRoot } from "../index.js";
import { replaceImagesWithPublicUrl } from "./replaceImagesWithPublicUrl.js";

const RENDER_RESULT_EVENT = "comet-mail-render-result";

export function MailRendererDecorator(Story: () => ReactNode, context: { globals: Record<string, unknown> }): ReactNode {
    const { html: rawHtml, mjmlWarnings } = renderMailHtml(
        <MjmlMailRoot>
            <Story />
        </MjmlMailRoot>,
    );

    const html = context.globals["usePublicImageUrls"] === true ? replaceImagesWithPublicUrl(rawHtml) : rawHtml;

    useEffect(() => {
        addons.getChannel().emit(RENDER_RESULT_EVENT, { html, mjmlWarnings });
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
