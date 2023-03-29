import { graphql } from "msw";
import { faker } from "@faker-js/faker";
import { compareAsc, compareDesc } from "date-fns";

type Launch = {
    id: string;
    mission_name: string;
    launch_date_local: Date;
};

const allLaunches: Launch[] = [];

for (let i = 0; i < 100; i += 1) {
    allLaunches.push({
        id: faker.datatype.uuid(),
        mission_name: faker.word.adjective(),
        launch_date_local: faker.datatype.datetime(),
    });
}

export const handlers = [
    graphql.query("LaunchesPast", (req, res, ctx) => {
        const { limit, offset, sort, order } = req.variables;

        let launches = [...allLaunches];

        if (sort && order) {
            launches = launches.sort((a, b) => {
                if (sort === "mission_name") {
                    if (order === "asc") {
                        return a.mission_name.localeCompare(b.mission_name);
                    } else {
                        return b.mission_name.localeCompare(a.mission_name);
                    }
                } else {
                    if (order === "asc") {
                        return compareAsc(a.launch_date_local, b.launch_date_local);
                    } else {
                        return compareDesc(a.launch_date_local, b.launch_date_local);
                    }
                }
            });
        }

        return res(
            ctx.data({
                launchesPastResult: {
                    data: launches.slice(offset, offset + limit),
                    result: {
                        totalCount: launches.length,
                    },
                },
            }),
        );
    }),
];
