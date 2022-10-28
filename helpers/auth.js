import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from './env.js';
import { addSeconds } from 'date-fns';

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const isPasswordSame = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const generateJWT = (payload, expiry = 604800) => {
    return {
        expiry: addSeconds(new Date(), Number(expiry)),
        token: jwt.sign(
            payload,
            env('JWT_SECRET'),
            {
                expiresIn: expiry,
                issuer: 'AMKLASS'
            },
        )
    }
};

export const validateJWTToken = (authorization) => {
    const [, token] = authorization?.split('Bearer ');
    return jwt.verify(token, env('JWT_SECRET'));
};