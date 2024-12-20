type FetcherArgs =
    | string
    | {
          url: string;
          params: URLSearchParams;
      };

export const fetcher = async (args: FetcherArgs) => {
    const url = typeof args === "string" ? args : args.url;
    const params =
        typeof args !== "string"
            ? // Filter keys where value is empty so that it doesn't get passed as a string "undefined".
              `${new URLSearchParams(Object.fromEntries(Object.entries(args.params).filter(([_key, val]) => val))).toString()}`
            : undefined;
    const response = await fetch(url + (params ? `?${params}` : ""));
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return response.json();
};
