import crypto from 'crypto';
import { otps } from "../db/inMemoryDb.js";

export const generateUniqueChar = async (length) => {
    const randomChar = generateRandomChar(length);
    const char = otps[randomChar]

    // the char already exists in memory, we need to recursively regenerate until we generate uniqeue char
    if (char) {
        randomChar = await generateUniqueChar(length);
    }
    return randomChar;
}

const safeRandomBytes = (length) => {
    try {
        return crypto.randomBytes(length);
    } catch (e) {
        return '';
    }
};

export const generateRandomChar = (length = 35, charset = 'alphanumeric') => {
    let chars;
    let string = '';

    const numbers = '0123456789';
    const charsLower = 'abcdefghijklmnopqrstuvwxyz';
    const charsUpper = charsLower.toUpperCase();
    const hexChars = 'abcdef';

    if (charset === 'alphanumeric') {
        chars = numbers + charsLower + charsUpper;
    } else if (charset === 'numeric') {
        chars = numbers;
    } else if (charset === 'alphabetic') {
        chars = charsLower + charsUpper;
    } else if (charset === 'hex') {
        chars = numbers + hexChars;
    } else {
        chars = charset;
    }

    const unreadableChars = /[0OIl]/g;
    chars = chars.replace(unreadableChars, '');

    const charsLen = chars.length;
    const maxByte = 256 - (256 % charsLen);
    while (length > 0) {
        const buf = safeRandomBytes(Math.ceil((length * 256) / maxByte));
        for (let i = 0; i < buf.length && length > 0; i += 1) {
            const randomByte = buf.readUInt8(i);
            if (randomByte < maxByte) {
                string += chars.charAt(randomByte % charsLen);
                length -= 1;
            }
        }
    }

    return string;
}