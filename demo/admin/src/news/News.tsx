import { Stack, StackPage, StackSwitch } from "@comet/admin";
import React from "react";
import { useIntl } from "react-intl";

import NewsForm from "./Form";
import NewsTable from "./Table";

const News: React.FC = () => {
    const intl = useIntl();

    return (
        <Stack topLevelTitle={intl.formatMessage({ id: "cometDemo.news.news", defaultMessage: "News" })}>
            <StackSwitch initialPage="table">
                <StackPage name="table">
                    <NewsTable />
                </StackPage>
                <StackPage name="edit" title={intl.formatMessage({ id: "cometDemo.news.editNews", defaultMessage: "Edit news" })}>
                    {(selectedId) => <NewsForm newsId={selectedId} />}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};

export default News;
