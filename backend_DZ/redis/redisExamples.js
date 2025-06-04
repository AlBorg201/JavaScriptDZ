const Redis = require('ioredis');
const redis = new Redis();

async function cacheUserData(userId, data) {
  await redis.set(`user:${userId}`, JSON.stringify(data), 'EX', 3600);
  const cached = await redis.get(`user:${userId}`);
  console.log('Cached user data:', JSON.parse(cached));
}

async function manageTaskQueue(task) {
  await redis.lpush('tasks', JSON.stringify(task));
  const tasks = await redis.lrange('tasks', 0, -1);
  console.log('Task queue:', tasks.map(JSON.parse));
}

async function trackUniqueVisitors(visitorId) {
  await redis.sadd('unique_visitors', visitorId);
  const visitors = await redis.smembers('unique_visitors');
  console.log('Unique visitors:', visitors);
}

async function storeUserProfile(userId, profile) {
  const key = `profile:${userId}`;
  const multi = redis.multi();
  for (const [field, value] of Object.entries(profile)) {
    multi.hset(key, field, value);
  }
  await multi.exec();
  const storedProfile = await redis.hgetall(key);
  console.log('User profile:', storedProfile);
}

async function updateLeaderboard(userId, score) {
  await redis.zadd('leaderboard', score, userId);
  const topUsers = await redis.zrange('leaderboard', 0, 2, 'WITHSCORES');
  console.log('Leaderboard:', topUsers);
}

(async () => {
  try {
    await cacheUserData('123', { name: 'Ivan', age: 30 });

    await manageTaskQueue({ taskId: 't1', description: 'Send email' });

    await trackUniqueVisitors('visitor1');
    await trackUniqueVisitors('visitor2');

    await storeUserProfile('123', { name: 'Ivan', email: 'Ivan@email.ru' });

    await updateLeaderboard('user1', 100);
    await updateLeaderboard('user2', 150);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await redis.quit();
  }
})();