import { Stack, StackPage, StackSwitch } from "@comet/admin";
import * as React from "react";
import { useIntl } from "react-intl";

import { NewsGrid } from "../generated/NewsGrid";
import { NewsForm } from "./NewsForm";

export function NewsPage(): React.ReactElement {
    const intl = useIntl();
    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "news.news", defaultMessage: "News" })}>
            <StackSwitch>
                <StackPage name="grid">
                    <NewsGrid />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "news.editNews", defaultMessage: "Edit News" })}>
                    {(selectedId) => <NewsForm id={selectedId} />}
                </StackPage>
                <StackPage name="add" title={intl.formatMessage({ id: "news.addNews", defaultMessage: "Add News" })}>
                    <NewsForm />
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}
