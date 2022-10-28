import fs from 'fs/promises'
import { generateJWT, isPasswordSame } from '../helpers/auth.js';
import { validateLogin } from '../validation/index.js';

export const loginController = async (req, res) => {
    // make sure we have valid inputs from users
    const validatedData = validateLogin(req.body)

    // query our mock db to check if the user has signup before
    const user = await findUserByEmail(validatedData.email)
    if (!user) {
        res.status(401)
            .json({
                success: false,
                message: 'user not found, pleasesignup to have access',
                data: {}
            });
        return
    }

    if (!isPasswordSame(validatedData.password, user.password)) {
        res.status(401)
            .json({
                success: false,
                message: 'invalid password',
                data: {}
            });
        return
    }

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