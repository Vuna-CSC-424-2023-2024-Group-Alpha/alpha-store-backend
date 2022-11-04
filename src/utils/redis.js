import redis from 'redis';
import { generateRandomChar } from '../helpers/rand.js';

// By default it will connect to a localhost redis server on a default port
const redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('[Redis CLIENT CONNECTED]');
});

redisClient.on('error', (err) => {
    console.log(`[Redis CLIENT CONNECTION ERROR] => `, err);
});


export const get = async (key) => {
    try {
        await redisClient.connect();
        return await redisClient.get(key);
    } catch (error) {
        console.log('[REDIS GET ERROR] => ', error);
        return null;
    } finally {
        await redisClient.disconnect();
    }
};

export const set = async (key, value) => {
    try {
        await redisClient.connect();
        return await redisClient.set(key, value);
    } catch (error) {
        console.log('[REDIS SET ERROR] => ', error);
        return null;
    } finally {
        await redisClient.disconnect();
    }
};

export const del = async (key) => {
    try {
        await redisClient.connect();
        return redisClient.del(key);
    } catch (error) {
        console.log('[REDIS DEL ERROR] => ', error);
    } finally {
        await redisClient.disconnect();
    }
};

export const setWithExpiration = async (key, durationInSeconds, value) => {
    try {
        await redisClient.connect();
        await redisClient.setEx(key, durationInSeconds, value);
        return key
    } catch (error) {
        console.log('[REDIS SETEX ERROR] => ', error);
        return null;
    } finally {
        await redisClient.disconnect();
    }
};

export const hSet = async (key, field, value) => {
    try {
        await redisClient.connect();
        return await redisClient.hSet([key, field, value]);
    } catch (error) {
        console.log('[REDIS HSET ERROR] => ', error);
    } finally {
        await redisClient.disconnect();
    }
};

export const hGet = async (key, field) => {
    try {
        await redisClient.connect();
        return await redisClient.hGet(key, field);
    } catch (error) {
        console.log('[REDIS HGET ERROR] => ', error);
    } finally {
        await redisClient.disconnect();
    }
};

export const hDel = async (key, field) => {
    try {
        await redisClient.connect();
        return redisClient.hDel(key, field);
    } catch (error) {
        console.log('[REDIS HDEL ERROR] => ', error);
    } finally {
        await redisClient.disconnect();
    }
};

export const expire = async (key, seconds) => {
    try {
        await redisClient.connect();
        return redisClient.expire(key, seconds);
    } catch (error) {
        console.log('[REDIS Expire ERROR] => ', error);
    } finally {
        await redisClient.disconnect();
    }
}

export const exists = async (key) => {
    try {
        await redisClient.connect();
        return await redisClient.exists(key);
    } catch (error) {
        console.log('[REDIS Exist? ERROR] => ', error);
    } finally {
        await redisClient.disconnect();
    }

}

export const generateUniqueChar = async (length, charset, prefix = '') => {
    const randomChar = generateRandomChar(length, charset);
    let uniqueChar = `${prefix}${randomChar}`

    const charExist = await exists(uniqueChar);

    if (charExist) {
        uniqueChar = await generateUniqueChar(length, charset, prefix);
    }

    return randomChar;
}