// require mongoose ,passport-local-mongoose
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = require('mongoose').Schema;

//user model

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    bio: String,
    cart: [
        {
            item: { type: Schema.Types.ObjectId, ref: 'Ecom' },
            quantity: { type: Number, default: 1 }
        }
    ],
    img:
    {
        data: Buffer,
        contentType: String,

    },


})

//hash password using passport 
userSchema.plugin(passportLocalMongoose);


//export user model
module.exports = mongoose.model('User', userSchema)

