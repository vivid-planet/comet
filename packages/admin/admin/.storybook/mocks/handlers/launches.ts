import { http, HttpResponse } from "msw";

export const launchesQueryHandler = http.get("/launches", () => {
    return HttpResponse.json([
        { id: "1", name: "FalconSat", date: "2006-03-24" },
        { id: "2", name: "DemoSat", date: "2007-03-21" },
        { id: "3", name: "Trailblazer", date: "2008-08-03" },
    ]);
});
