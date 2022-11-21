import { CurrentUser } from "../dto/current-user.dto";

export interface CurrentUserService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadUser: (data: any) => Promise<CurrentUser>;
}
