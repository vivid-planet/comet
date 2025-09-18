// Workaround for missing ESM support from https://github.com/simov/slugify/issues/173#issuecomment-1476782630

import pluralize from "pluralize";

export default pluralize as unknown as typeof pluralize;
