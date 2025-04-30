import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export const setKey = async (key: string, value: string) => {
  await redis.set(key, value);
}

export const getKey = async (key: string) => {
  return await redis.get(key);
}

export const delKey = async (key: string) => {
  await redis.del(key);
}

export const setKeyWithExpire = async (key: string, value: string, expire: number) => {
  await redis.set(key, value, 'EX', expire || 86400);
}

// 序列化对象
export const serialize = (obj: any) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return obj;
  }
}
// 反序列化对象
export const deserialize = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export default redis;