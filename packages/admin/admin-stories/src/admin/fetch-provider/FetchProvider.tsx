import { createFetch, FetchProvider, useFetch } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function ExampleFetch() {
    const fetch = useFetch();
    const [data, setData] = React.useState<Record<string, unknown> | null>(null);
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/people`);
            setData(await response.json());
        };
        fetchData();
    }, [fetch]);
    return <div>{JSON.stringify(data)}</div>;
}

function Story() {
    const fetch = createFetch({
        baseUrl: "https://swapi.co/api",
        interceptHeaders: async (headers: Headers) => {
            // headers.append("x-foo", "bar");
        },
    });

    return (
        <FetchProvider value={fetch}>
            <ExampleFetch />
        </FetchProvider>
    );
}

storiesOf("@comet/admin/fetch-provider", module).add("FetchProvider", () => <Story />);
