import {Router} from "express";
import { verifyEmailCotroller,registerUserController,loginController, logoutController, uploadAvatar, updateUserDetails, forgotPasswordController, resetpassword ,verifyForgotPasswordOtp, refreshToken}  from "../controllers/user.controller.js";
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register",registerUserController);
userRouter.post("verify-email", verifyEmailCotroller)
userRouter.post("/login",loginController)
userRouter.get('/logout', auth, logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUserDetails)
console.log("hi")
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token', refreshToken)
export default userRouter;