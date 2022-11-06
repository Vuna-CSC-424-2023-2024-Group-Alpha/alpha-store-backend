import dotenv from 'dotenv';
dotenv.config();

export const env = (name, validate = true) => {
    const value = process.env[name];

    if (!value && validate) {
        throw new Error(`Missing: process.env['${name}'].`);
    }

    return value || '';
}