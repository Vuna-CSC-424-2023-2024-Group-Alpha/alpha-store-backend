import joi from '@hapi/joi';
import { validator } from "./validator.js";


export const validateSignup = (requestData) => validator(requestData, joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim(),
    email: joi.string().email().trim().required(),
    password: joi.string().required(),
}));

export const validateLogin = (requestData) => validator(requestData, joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().required(),
}));

export const validateOtpCode = (requestData) => validator(requestData, joi.object({
    otp: joi.string().trim().required(),
}));