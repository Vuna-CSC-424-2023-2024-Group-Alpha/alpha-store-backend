import fs from 'fs/promises'
import { generateJWT, hashPassword } from '../helpers/auth.js';
import { generateUniqueChar } from '../helpers/generateUniqueChars.js';
import { validateOtpCode, validateSignup } from '../validation/index.js';
import { otps } from "../db/inMemoryDb.js";
var postmark = require("postmark");

// Send an email:
var client = new postmark.ServerClient("9c147ba6-4aca-4bb2-b75a-6eb9854de89c");



export const SignUpController = async (req, res) => {
    // make sure we have valid inputs from users
    const validatedData = validateSignup(req.body)
    console.log(otps)
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

    const otpCode = await generateUniqueChar(6)

    // we can use Redis to save the otpCode for later use, but in our case i am going to save directly to memory
    saveOtpForLater(otpCode, validatedData.email)

    // send an email to the user with the otp code to veryfy email below
  
    client.sendEmail({
        "From": "Muhammad@haqqman.com",
        "To": validatedData.email,
        "Subject": "welcome to haqqman",
        "TextBody": otpCode
      });
      res.status(200).json({})
}

export const emailVerificationController = async (req, res) => {
    const { otp } = validateOtpCode(req.body)

    if (!otps[otp]) {
        res.status(401)
            .json({
                success: false,
                message: 'Invalid otp',
                data: {}
            });
    }
    const userEmail = otps[otp]

    const user = findUserByEmail(userEmail)

    // generate jwt and signup the user
    res.status(200).json({
        authorization: generateJWT({ use: 'user', id: user.id }, Number(env('JWT_TOKEN_EXPIRY_IN_SECONDS', false) || 40000)),
        user
    })

}

const findUserByEmail = async (email) => {
    let data = await fs.readFile('C:/Users/user/Desktop/express-task/src/db/users.json')
    if (data) {
        data = JSON.parse(data)
        return data.find((d) => d.email === email)
    } else {
        return null
    }
}

const saveUser = async (user) => {
    let users = await fs.readFile('C:/Users/user/Desktop/express-task/src/db/users.json')
    users = JSON.parse(users)

    const usersLength = users.length
    users.push({ ...user, id: String(usersLength + 1) })
    await fs.writeFile('C:/Users/user/Desktop/express-task/src/db/users.json', JSON.stringify(users))
}

const saveOtpForLater = (otp, userEmail) => {
    otps[otp] = userEmail
}