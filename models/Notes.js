import mongoose from "mongoose";
const schema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    title:{
        type:String,
        default:'No title given.'
    },
    description:{
        type:String,
        default:'No description given.'
    },
    tag:{
        type:String,
        default:'General'
    },
    date:{
        type:Date,
        default:Date.now
    }
})
export const Notes = mongoose.model('Note',schema)
