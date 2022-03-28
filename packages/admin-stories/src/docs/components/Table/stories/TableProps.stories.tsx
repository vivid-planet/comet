import { Table } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Table/Table Props", module)
    .add("Table Name Prop", () => {
        const data = [
            { id: 1, firstname: "Kady" },
            { id: 2, firstname: "Lewis" },
            { id: 3, firstname: "Tom" },
            { id: 4, firstname: "Mia" },
        ];

        return (
            <Table
                data={data}
                totalCount={data.length}
                columns={[
                    {
                        name: "firstname",
                        header: "First Name",
                    },
                ]}
            />
        );
    })
    .add("Table Nested Name Prop", () => {
        const data = [
            { id: 1, job: { name: "Project Manager" } },
            { id: 2, job: { name: "UI/UX Designer" } },
            { id: 3, job: { name: "Frontend Developer" } },
            { id: 4, job: { name: "Backend Developer" } },
        ];

        return (
            <Table
                data={data}
                totalCount={data.length}
                columns={[
                    {
                        name: "job.name",
                        header: "Job (Nested)",
                    },
                ]}
            />
        );
    })
    .add("Table Render Prop", () => {
        const data = [
            { id: 1, firstname: "Kady", lastname: "Wood" },
            { id: 2, firstname: "Lewis", lastname: "Chan" },
            { id: 3, firstname: "Tom", lastname: "Weaver" },
            { id: 4, firstname: "Mia", lastname: "Carroll" },
        ];

        return (
            <Table
                data={data}
                totalCount={data.length}
                columns={[
                    {
                        name: "name",
                        header: "Name",
                        render: (row) => (
                            <>
                                {row.firstname} <strong>{row.lastname}</strong>
                            </>
                        ),
                    },
                ]}
            />
        );
    });
