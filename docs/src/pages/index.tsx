import { Redirect } from "@docusaurus/router";

export default function Home(): JSX.Element {
    /* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */
    return <Redirect to="/docs" />;
}
