import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email :{
        type:String,
        required:[true,"Email is required"],
        unique:true
    }
    ,
    password:{
        type:String,
        required:[true,"Password is required"]
    }

    ,
    avtar:{
        type:String,
        default:""
    },
    mobile:{
        type:Number,
        default:null
    },

    refresh_token:{
        type:String,
        default:""
    } ,
    verify_email:{
        type:Boolean,
        default:false
    },
    last_login:{
        type:Date,      
        default:null
    }, 

    status:{
        type:String,
        enum:["active","inactive","suspended"],
        default:"active"
    },
    adress_details:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "adress"
    },
     shopping_cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "cartProduct"
    },
     orderHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "order"
    },

    forgot_password_otp:{
        type:String,
        default:null
    },
    forgot_password_expiry:{
        type:Date,
        default:""
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
}, {
    timestamps:true

})
const User = mongoose.model("user",userSchema);
export default User ;


