import { type NextApiRequest, type NextApiResponse } from "next";

const Status = (req: NextApiRequest, res: NextApiResponse): void => {
    res.statusCode = 200;
    res.send("OK");
};
export default Status;
