import { HttpLink } from "@apollo/client";
import config from "@src/config";

export const httpLink = new HttpLink({
    uri: `${config.API_URL}/graphql`,
});
