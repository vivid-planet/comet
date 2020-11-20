import { storiesOf } from "@storybook/react";
import { fetchProvider } from "@vivid-planet/react-admin";
import * as React from "react";

const { createFetch, FetchProvider, useFetch } = fetchProvider;

function ExampleFetch() {
    const fetch = useFetch();
    const [data, setData] = React.useState<object | null>(null);
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/people`);
            setData(await response.json());
        };
        fetchData();
    }, []);
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

storiesOf("fetch-provider", module).add("FetchProvider", () => <Story />);
