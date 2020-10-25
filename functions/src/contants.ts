// Max time a function is allowed to run.
// This only applies to 'new-img-for-user', because uploading may take some time.
// All other functions have the default max time of 60 seconds
export const maximumFunctionRuntime = 9 * 60; // 9 minutes (in seconds)

// Version of this Peppermint instance
export const packageVersion = require('../package.json').version;

// User Agent to identify Peppermint when using the Reddit API
export const userAgentString = `nodejs:me.niels.peppermint:${packageVersion} (by u/Naerten)`;

// How often should old images be pruned from personal collections?
export const pruningInterval = 24 * 1000 * 60 * 60; // 24 hours (in seconds)

// How often scheduled functions should run
export const intervals = {
  fetchNewPosts: 'every 4 hours',
  deleteOldImages: 'every 4 hours',
};
