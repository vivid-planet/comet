declare module "@comet/cms-api" {
    interface ContentScope {
        domain: "main" | "secondary";
        language: string;
    }
}

export {};
