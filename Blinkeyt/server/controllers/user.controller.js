import UserModel from "../models/user.model.js"
import bcrypt from "bcryptjs"
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccesstoken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";

import uploadImageCloudinary from "../utils/uploadimageClodinary.js";
import generatedOtp from "../utils/generatedOtp.js";

import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken"


export const registerUserController =async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({message:"All fields are required",
            error:true,
            success:false
        })    
        }

        const user = await UserModel.findOne({email:email});

        if (user) {
            return res.json({message:"User already exists",
            error:true,
            success:false
        })    
        }
        console.log(email)

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        const payload = {name,email,password:hashPassword};
        const newUser = new UserModel(payload);
        const save = await newUser.save();
        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email/${save._id}`;
        console.log(email);
        const verifyEmail = await sendEmail({
  email: email,  // ✅ lowercase
  subject: "Verify email from blinkeyt",
  html: verifyEmailTemplate({
    name,
    url: verifyEmailUrl
  })
});
            
        return res.json({message:"User registered successfully, please verify your email",
            error:false,
            success:true,
            data:save
        })


        
    } catch (error) {
        return res.status(500).json({message:error.message||error,
            error:true,
            success:false
        })    
    }
      
}


export async function verifyEmailCotroller(req,res){
try {
    const code = req.body
    const user = await UserModel.findOne({_id: code})
    if(!user){
        res.status(400).json({
            message: "invalid code",
            error:true,
            success: false

        })
    }

    const updateUser = await UserModel.updateOne({_id:code},{
        verify_email:true
    })
    return res.json({
        message: "verify email done"
    })
} catch (error) {
    return res.status(500).json(
        {
            message: error.message|| error,
            error: true,
            success:true
        }
    )
}
}

export async function loginController(req, res){
    try {
        const {email, password} = req.body
        const user = await UserModel.findOne({
            email
        })

        if(!user.password || !user.email){
            res.status(400).json({
                message:"provide message or password",
                error: true,
                success: false
            })
        }

        if (!user){
            return res.status(400).json({
                message: "User not register",
                error: true,
                success: false
            })
        }

        if(user.status!="active" ){
            res.status(400).json({
                message: "Contact to Admin",
                error : true,
                success: false
            })
        }
        
        const checkPassword = await bcrypt.compare(password,user.password)
        if(!checkPassword){
            return res.status(400).json({
                message : "Check your password",
                error : true,
                success: false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id) 

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"

        }
        res.cookie('accessToken', accesstoken,cookiesOption)
        res.cookie('refreshToken', refreshToken,cookiesOption)

        return res.json({
            message: "login succesfully",
            error : false,
            success: true,
            data : {
                accesstoken, refreshToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message|| error,
            error:true,
            succes:false
        })
    }
}

export async function logoutController(req, res){
    try {

        const userid = req.userId

         const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"

        }

        res.clearCookie("accesstoken","cookiesOption")
        res.clearCookie("refreshToken","cookiesOption")
        const removRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token: ""
        })


        return res.json({
            message: "Logout successfully",
            error : false,
            success: true
        })
    } catch (error) {
        return res.status(400).json({

        })
    }
}

export async function uploadAvatar(req,res){
try {
    const userId = req.userId
    const image = req.file
    
    const upload =await uploadImageCloudinary(image)
    const updateUser = await UserModel.findByIdAndUpdate(userId, {
        avtar: upload.url
    })

    return res.json({
        message: "upload profile",
        data : {
            _id :userId,
            avatar: upload.url
        }
    })
    
} catch (error) {
    return res.status(500).json({
        message : error.message || error,
        error : true,
        success: false
    })
}
}

export async function updateUserDetails(req, res){
    try {
        const userId = req.userId // coming from auth middleware
        const {name, email, mobile, password} = req.body
        let hashPassword
        if(password){
        const salt = await bcrypt.genSalt(10);
        hashPassword = await bcrypt.hash(password,salt);

        }
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            ...(name && {name: name}),
            ...(mobile && {mobile: mobile}),
            ...(email && {email: email}),
            ...(password && {password: hashPassword})
            
        },{new: true})

        return res.json({
            message: "updated user successfully",
            error: false,
            success: true,
            data: updateUser
        })

    } catch (error) {
        return res.message.status(500).json({
            message:error.message|| error,
            error: true,
            success: false
        })
    }
}

// forgot password
export async function forgotPasswordController(req, res){
    try {
        const {email} = req.body
        const user = await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                messaga: "user email is not found",
                error: true, 
                success: false
            })
        }



        const otp = generatedOtp()
        const expireTime = new Date() + 60*60*1000

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp: otp, 
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        
        await sendEmail({
            email: email,
            subject: "forgot password from Binkeyit",
            html: forgotPasswordTemplate({
                name: user.name,
                otp : otp
            })
        })

        return res.json({
            message: "check your email",
            error: false,
            success: true
        });


        
    } catch (error) {
        return res.status(500).json({
            message: error.message|| error,
            error: true,
            success: false

        })
    }
    
}

// vedify forgot password

export async function verifyForgotPasswordOtp(req, res){

    try {
        const {email, otp} = req.body
        

        if(!email || !otp){
            return res.status(400).json({
                message: "provide required field email, otp",
                error : true,
                success: false
            })
        }


        const user = await UserModel.findOne({email})

          if(!user){
            return res.status(400).json({
                messaga: "user email is not found",
                error: true, 
                success: false
            })
        }

        const currentTime = new Date().toISOString()
        if(user.forgot_password_expiry < currentTime){
            return res.status(400).json({
                message: "Otp is expired",
                error : false,
                success: false
            })
        }


        if(otp !== user.forgot_password_otp){
            return res.status(400).json({
                message: "Inavalid otp",
                error : true,
                success: false
            })
        }

        // if otp is not expire and otp is user.forgot_password === otp

        return res.json({
            message: "verify otp successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function resetpassword(req,res){
    try {
        const {email, newPassword, confirmPassword} = req.body
        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message: "provide required fields email, newPassword, confirpassword"

            }

            )
        }

        const user = await UserModel.findOne({
            email
        })

        if(!user){
            return res.status(400).json({
                message: "email is not available",
                error: true,
                success: false
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(500).json({
                message: "newpassword and confirmpassword not same.",
                error: true,
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        console.log("hii")
        const update = await UserModel.findOneAndUpdate(user._id, {
            password : hashPassword
        })

        return res.json({
            message: "password updated successfully",
            error : false, 
            success : true

        })

    } catch (error) {
        return res.status(500).json({
            message: error.messaga|| error,
            error: true, 
            success: false
        })
    }
}

export async function refreshToken(req, res){
    try {
        const refreshToken =req.cookies?.refreshToken ||req.get("authorization")?.split(" ")[1];
        if(!refreshToken){
            return res.status(402).json({
                message: "invalid token",
                error : true,
                success: false
            })
        }
        
        const verifyToken= await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)
        if(!verifyToken){
            return res.status(401).json({
                message: "token is expired",
                error : true,
                success: false
    
            })
        }
        const userId = verifyToken?._id
        const newAccessToken = await generatedAccessToken(userId)
         const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"

        }
        res.cookie('accessToken',newAccessToken,cookiesOption)
        return res.json({
            message: "new access toke generated",
            error : false,
            success: true,
            data: {
                accesstoken: newAccessToken

            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error : true, 
            success: false
        })
    }
}

export default registerUserController



