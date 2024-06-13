/*
const cache = new Map()
 
module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
  }
 
  async get(key) {
    // This could be stored anywhere, like durable storage
    const ret = cache.get(key)
    if (ret === undefined) {
        console.log('cache miss', key)
    } else {
        console.log('cache hit', key)
    }
    return ret;
  }
 
  async set(key, data, ctx) {
    // This could be stored anywhere, like durable storage
    console.log('cache set', key)
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    })
  }
 
  async revalidateTag(tag) {
    // Iterate over all entries in the cache
    for (let [key, value] of cache) {
      // If the value's tags include the specified tag, delete this entry
      if (value.tags.includes(tag)) {
        cache.delete(key)
      }
    }
  }
}
*/
import { CacheHandler } from '@neshca/cache-handler';
import createLruHandler from '@neshca/cache-handler/local-lru';
import createRedisHandler from '@neshca/cache-handler/redis-strings';
import { createClient } from 'redis';
 
CacheHandler.onCreation(async () => {

  const client = createClient({
    url: process.env.REDIS_URL,
  });
 
  client.on('error', () => {});
 
  await client.connect();
 
  const redisHandler = await createRedisHandler({
    client,
    // timeout for the Redis client operations like `get` and `set`
    // after this timeout, the operation will be considered failed and the `localHandler` will be used
    timeoutMs: 5000,
  });
 
  const localHandler = createLruHandler();
 
  return {
    handlers: [redisHandler, localHandler],
  };
});
 
export default CacheHandler;