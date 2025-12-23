import mongoose from "mongoose";
const cartProductSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.ObjectId,
        ref:"product"
    },
    quantity:{
        type:Number,
        default:1
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    }
},{
    timestamps:true
});


const CartProductmodel = mongoose.model("cartproduct", cartProductSchema);
export default CartProductmodel;