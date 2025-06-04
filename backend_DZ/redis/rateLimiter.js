const Redis = require('ioredis');
const redis = new Redis();

async function registrationRateLimiter(ip, maxAttempts = 5, windowInSeconds = 3600) {
  const key = `rate:register:${ip}`;
  const current = await redis.get(key);

  if (current && parseInt(current) >= maxAttempts) {
    const ttl = await redis.ttl(key);
    throw new Error(`Слишком много попыток регистрации. Попробуйте снова через ${ttl} секунд.`);
  }

  await redis.multi()
    .incr(key)
    .expire(key, windowInSeconds)
    .exec();

  return true;
}

async function postRateLimiter(userId, maxAttempts = 100, windowInSeconds = 3600) {
  const key = `rate:post:${userId}`;
  const current = await redis.get(key);

  if (current && parseInt(current) >= maxAttempts) {
    const ttl = await redis.ttl(key);
    throw new Error(`Слишком много POST-запросов. Попробуйте снова через ${ttl} секунд.`);
  }

  await redis.multi()
    .incr(key)
    .expire(key, windowInSeconds)
    .exec();

  return true;
}

module.exports = { registrationRateLimiter, postRateLimiter };