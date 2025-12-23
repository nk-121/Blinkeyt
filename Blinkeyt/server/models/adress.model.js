import mongoose from "mongoose";

const adressSchema = new mongoose.Schema({
    address_line:{
        type:String,
        default:""
    },
    city:{
        type:String,
        defualt:""
    },
    state:{
        type:String,
        default:""  
    },
    pincode:{
        type:String,

    },
    conntory:{
        type:String,

    },
    mobile:{
        type:Number,
        default:null
    }
    ,status:{
        type:Boolean,
        default:true
    }


},{
    timestamps:true 
})

const Adressmodel = mongoose.model("adress", adressSchema);
export default Adressmodel;