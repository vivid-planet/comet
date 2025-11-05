export class NotFoundError {
    isNotFound = true;
    constructor() {}
}

export class RedirectError {
    isRedirect = true;
    target: string;
    constructor(target: string) {
        this.target = target;
    }
}
