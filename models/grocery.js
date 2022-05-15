const mongoose = require("mongoose")
const Schema = mongoose.Schema

const GrocerySchema = new Schema({
    name : {
        type: String,
        required : true
    },
    category: { 
        type : String,
        required : true
    },
    price: { 
        type : String,
        required : true
    }
}, {timestamps: true})

const Grocery = mongoose.model("Grocery", GrocerySchema)
module.exports = Grocery