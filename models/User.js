import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    'name':{
        type:String,
        isRequired:true
    },
    'password':{
        type:String,
        isRequired:true
    },
    'email':{
        type:String,
        isRequired:true,
        unique:true
    },
    'timestamp':{
        type: Date,
        default:Date.now
    }
})
export const User = mongoose.model('User',UserSchema)