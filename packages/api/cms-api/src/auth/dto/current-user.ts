export interface CurrentUser {
    id: string;
    role: string | undefined;
    contentScopes?: Array<Record<string, string>>;
}

/*
contentScrops: [
    {
        domain: "at",
    }
]
*/
