// Workaround for missing ESM support from https://github.com/simov/slugify/issues/173#issuecomment-1476782630

import slugify from "slugify";

export default slugify as unknown as typeof slugify.default;
