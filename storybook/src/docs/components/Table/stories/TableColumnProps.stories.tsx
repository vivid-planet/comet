import { Table } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Table/Table Column Props", module)
    .add("Table Column Name Prop", () => {
        const data = [
            { id: 1, firstname: "Kady" },
            { id: 2, firstname: "Lewis" },
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
    .add("Table Column Nested Name Prop", () => {
        const data = [
            { id: 1, job: { name: "Project Manager" } },
            { id: 2, job: { name: "UI/UX Designer" } },
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
    .add("Table Column Render Prop", () => {
        const data = [
            { id: 1, firstname: "Kady", lastname: "Wood" },
            { id: 2, firstname: "Lewis", lastname: "Chan" },
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
    })
    .add("Table Column Header Prop", () => {
        const data = [
            { id: 1, firstname: "Kady", lastname: "Wood" },
            { id: 2, firstname: "Lewis", lastname: "Chan" },
        ];

        return (
            <Table
                data={data}
                totalCount={data.length}
                columns={[
                    {
                        name: "id",
                    },
                    {
                        header: "First Name",
                        name: "firstname",
                    },
                    {
                        header: <strong>Last Name</strong>,
                        name: "lastname",
                    },
                ]}
            />
        );
    })
    .add("Table Column Visible Prop", () => {
        const data = [
            { id: 1, firstname: "Kady", lastname: "Wood" },
            { id: 2, firstname: "Lewis", lastname: "Chan" },
        ];

        const [idVisible, setIdVisible] = React.useState(false);

        return (
            <>
                <p>
                    <Button onClick={() => setIdVisible((visible) => !visible)} variant="contained" color="primary">
                        Show ID Column
                    </Button>
                </p>
                <Table
                    data={data}
                    totalCount={data.length}
                    columns={[
                        {
                            visible: idVisible,
                            header: "ID",
                            name: "id",
                        },
                        {
                            header: "First Name",
                            name: "firstname",
                        },
                        {
                            header: "Last Name",
                            name: "lastname",
                        },
                    ]}
                />
            </>
        );
    });
