const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email : {
        type: String,
        required : true,
        lowercase : true    
    },
    password: { 
        type : String,
        required : true
    },
    firstname: { 
        type : String,
        required : true
    },
    lastname: { 
        type : String,
        required : true
    },
    permissionLevel: { 
        type : Number,
        required : true
    }
})

const User = mongoose.model("User", UserSchema)
module.exports = User