import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,  
        ref:"user"
    },
    orderId:{
        type:String,
        required:true,
        unique:true
    },
    productId:{
        type:mongoose.Schema.ObjectId,  
        ref:"product"
    },
    product_details:{
        _id :String,
        name:String,
        image:Array
    },

    payemntId:{
        type:String,
        default:""
    },
    payment_status:{
        type:String,
        defualt:String
    },

    delivery_address:{
        type:mongoose.Schema.ObjectId,
        ref:"adress"
    },
    subTotal:{
        type:Number,
        default:0
    },
    totalAmt:{
        type:Number,
        default:0
    },
    invoice_receipt:{
        type:String,
        default:""
    }
}, {
    timestamps:true
});

const Ordermodel = mongoose.model("order", orderSchema);
export default Ordermodel;

