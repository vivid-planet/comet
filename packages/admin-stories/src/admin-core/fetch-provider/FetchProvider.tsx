import { createFetch, FetchProvider, useFetch } from "@comet/admin-core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function ExampleFetch() {
    const fetch = useFetch();
    const [data, setData] = React.useState<object | null>(null);
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

storiesOf("@comet/admin-core/fetch-provider", module).add("FetchProvider", () => <Story />);
