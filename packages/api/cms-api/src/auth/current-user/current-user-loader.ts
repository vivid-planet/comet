import { Injectable } from "@nestjs/common";

@Injectable()
export class CurrentUserJwtLoader<CurrentUser> implements CurrentUserLoaderInterface<CurrentUser> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(data: any): Promise<CurrentUser> {
        const user = {
            id: data.sub,
            name: data.name,
            email: data.email,
            language: data.email,
            role: data.ext?.role,
            rights: data.ext?.rights,
        };
        return user as unknown as CurrentUser;
    }
}

@Injectable()
export class CurrentUserStaticLoader<CurrentUser> implements CurrentUserLoaderInterface<CurrentUser> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(data: any): Promise<CurrentUser> {
        return data;
    }
}

export interface CurrentUserLoaderInterface<CurrentUser> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load: (data: any) => Promise<CurrentUser>;
}
