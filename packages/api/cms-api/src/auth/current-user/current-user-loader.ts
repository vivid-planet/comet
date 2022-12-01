import { Injectable } from "@nestjs/common";

import { CurrentUserInterface } from "./current-user";

@Injectable()
export class CurrentUserJwtLoader implements CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(data: any): Promise<CurrentUserInterface> {
        return {
            id: data.sub,
            name: data.name,
            email: data.email,
            language: data.language,
            role: data.ext?.role,
            rights: data.ext?.rights,
        };
    }
}

@Injectable()
export class CurrentUserStaticLoader implements CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(data: any): Promise<CurrentUserInterface> {
        return data;
    }
}

export interface CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load: (data: any) => Promise<CurrentUserInterface>;
}
