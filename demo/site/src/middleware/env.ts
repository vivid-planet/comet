export type MiddlewareEnv = {
    Variables: {
        /** Set by middlewares that rewrite the pathname before the domain rewrite */
        rewrittenPathname: string | undefined;
    };
};
