import Keyv from 'keyv';

export const store = new Keyv({
  ttl: 60 * 1000 // 60秒过期时间
});