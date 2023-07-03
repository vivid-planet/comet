export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    language: string;
}

export interface CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load: (data: any) => Promise<CurrentUserInterface>;
}
