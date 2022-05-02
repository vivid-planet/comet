import { Table } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

interface Person {
    id: number;
    firstname: string;
    lastname: string;
    job: {
        id: number;
        name: string;
    };
}

storiesOf("stories/components/Table/Basic Table", module).add("Basic Table", () => {
    const data: Person[] = [
        { id: 1, firstname: "Kady", lastname: "Wood", job: { id: 1, name: "Project Manager" } },
        { id: 2, firstname: "Lewis", lastname: "Chan", job: { id: 2, name: "UI/UX Designer" } },
        { id: 3, firstname: "Tom", lastname: "Weaver", job: { id: 3, name: "Frontend Developer" } },
        { id: 4, firstname: "Mia", lastname: "Carroll", job: { id: 4, name: "Backend Developer" } },
    ];

    return (
        <Table
            data={data}
            totalCount={data.length}
            columns={[
                {
                    name: "id",
                    header: "ID",
                },
                {
                    name: "name",
                    header: "Name",
                    render: (row) => (
                        <>
                            {row.firstname} <strong>{row.lastname}</strong>
                        </>
                    ),
                },
                {
                    name: "job.name",
                    header: "Job (Nested)",
                },
            ]}
        />
    );
});
