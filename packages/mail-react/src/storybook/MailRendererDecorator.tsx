import { useChannel, useGlobals, useParameter } from "storybook/preview-api";

import { renderMailHtml } from "../client/renderMailHtml.js";
import { MjmlMailRoot } from "../components/mailRoot/MjmlMailRoot.js";
import type { Theme } from "../theme/themeTypes.js";
import { replaceImagesWithPublicUrl } from "./replaceImagesWithPublicUrl.js";

const RENDER_RESULT_EVENT = "comet-mail-render-result";

export function MailRendererDecorator(Story: () => React.JSX.Element) {
    const [globals] = useGlobals();
    const emit = useChannel({});
    const theme = useParameter<Theme>("theme");

    const { html: rawHtml, mjmlWarnings } = renderMailHtml(
        <MjmlMailRoot theme={theme}>
            <Story />
        </MjmlMailRoot>,
    );

    for (const warning of mjmlWarnings) {
        console.warn("MJML warning:", warning);
    }

    const html = globals.usePublicImageUrls ? replaceImagesWithPublicUrl(rawHtml) : rawHtml;

    emit(RENDER_RESULT_EVENT, { html, mjmlWarnings });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
