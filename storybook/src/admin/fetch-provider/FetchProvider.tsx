import { createFetch, FetchProvider, useFetch } from "@comet/admin";
import * as React from "react";

function ExampleFetch() {
    const fetch = useFetch();
    const [data, setData] = React.useState<object | null>(null);
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/launches`);
            setData(await response.json());
        };
        fetchData();
    }, [fetch]);
    return <div>{JSON.stringify(data)}</div>;
}

function Story() {
    const fetch = createFetch({
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

export default {
    title: "@comet/admin/fetch-provider",
};

export const _FetchProvider = () => <Story />;

_FetchProvider.storyName = "FetchProvider";
