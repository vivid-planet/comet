import { Table } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as numeral from "numeral";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

function Story() {
    const tableData = {
        data: [
            { id: 1, name: "User 1" },
            { id: 2, name: "User 2" },
            { id: 3, name: "User 3" },
        ],
        totalCount: 100000,
        pagingInfo: { attachTableRef: () => {} },
    };

    return (
        <Table
            rowName="Users"
            renderTotalCount={getFormattedNumber}
            {...tableData}
            columns={[
                {
                    name: "name",
                    header: "Name",
                },
            ]}
        />
    );
}

function getFormattedNumber(totalCount: number) {
    return numeral(totalCount).format("0,0.00");
}

interface IResponseLinks {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
}
storiesOf("@comet/admin/table", module)
    .addDecorator(
        apolloStoryDecorator({
            responseTransformer: async (response) => {
                const links: IResponseLinks = {};
                const linkMatches = response.headers.get("link").match(/<(.*?)>; rel="(.*?)"/g) || [];
                linkMatches.forEach((i: string) => {
                    const m = i.match(/<(.*?)>; rel="(.*?)"/);
                    if (m) {
                        links[m[2] as keyof IResponseLinks] = m[1];
                    }
                });
                return {
                    data: await response.json(),
                    meta: {
                        links,
                        totalCount: response.headers.get("x-total-count"),
                    },
                };
            },
        }),
    )
    .add("Formatted Total Count", () => <Story />);
