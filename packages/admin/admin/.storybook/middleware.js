export default function middleware(router) {
    router.use((req, res, next) => {
        const origin = req.headers.origin;

        if (origin?.startsWith("http://localhost:")) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Credentials", "true");
        }

        next();
    });
}
