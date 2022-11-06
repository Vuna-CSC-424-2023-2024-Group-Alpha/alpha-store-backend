import fs from 'fs/promises'
import { generateJWT, hashPassword } from '../helpers/auth.js';
import { generateUniqueChar } from '../helpers/rand.js';
import { validateOtpCode, validateSignup } from '../validation/index.js';
import postmark from 'postmark'
import { get, setWithExpiration } from '../utils/redis.js';
import { env } from "../helpers/env.js";



// Our mock databse location, replace this with the exact location on your machine
const mockDbLocation = 'C:/Users/user/Desktop/express-boilerplate-1/src/database/users.json';

// Send an email:
let client = new postmark.ServerClient("9c147ba6-4aca-4bb2-b75a-6eb9854de89c");

export const SignUpController = async (req, res) => {
    // make sure we have valid inputs from users
    const validatedData = validateSignup(req.body)
    // query our mock db to check if the user has signup before
    const user = await findUserByEmail(validatedData.email)
    if (user) {
        res.status(401)
            .json({
                success: false,
                message: 'Already signed up with this email',
                data: {}
            });
        return
    }

    // hash the user password before saving
    validatedData.password = await hashPassword(validatedData.password)
    await saveUser(validatedData)

    const otpCode = await generateUniqueChar(6, 'signupVerification:')

    // teporary store the otp code in redis
    await setWithExpiration(`signupVerification:${otpCode}`, 18000, validatedData.email);

    // send an email to the user with the otp code to veryfy email below
    console.log(otpCode)
    client.sendEmail({
        "From": "ibrahimsuleiman1996@gmail.com",
        "To": validatedData.email,
        "Subject": "welcome to haqqman",
        "TextBody": otpCode
    });
    res.status(200).json({})
}

export const emailVerificationController = async (req, res) => {
    const { otp } = validateOtpCode(req.body)

    const email = await get(`signupVerification:${otp}`);

    if (!email) {
        res.status(401)
            .json({
                success: false,
                message: 'Invalid otp',
                data: {}
            });
    }

    const user = await findUserByEmail(email)

    // you can now activate the user on the database since his email is now verified

    // generate jwt and signup the user
    res.status(200).json({
        authorization: generateJWT({ use: 'user', id: user.id }, Number(env('JWT_TOKEN_EXPIRY_IN_SECONDS', false) || 40000)),
        user
    })

}

const findUserByEmail = async (email) => {
    let data = await fs.readFile(mockDbLocation)
    if (data) {
        data = JSON.parse(data)
        return data.find((d) => d.email === email)
    } else {
        return null
    }
}

const saveUser = async (user) => {
    let users = await fs.readFile(mockDbLocation)
    users = JSON.parse(users)

    const usersLength = users.length
    users.push({ ...user, id: String(usersLength + 1) })
    await fs.writeFile(mockDbLocation, JSON.stringify(users))
}