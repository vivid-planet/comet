export class NotFoundError extends Error {
    constructor() {
        super("NotFound");
    }
}
export class RedirectError extends Error {
    target: string;
    constructor(target: string) {
        super("Redirect");
        this.target = target;
    }
}
