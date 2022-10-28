import { Router } from 'express'
import { SignUpController, emailVerificationController } from '../controllers/signup.js'
import { loginController } from "../controllers/login.js";
const router = Router()

router.post('/signup', SignUpController)
router.post('/login', loginController)
router.post('/verifyemail', emailVerificationController)

export default router