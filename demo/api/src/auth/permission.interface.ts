declare module "@comet/cms-api" {
    interface Permission {
        news: {
            commentsEdit: boolean;
        };
        products: Record<string, never>;
    }
}

export {};
