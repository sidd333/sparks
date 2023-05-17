
const Schema = require('mongoose').Schema;
 
var mongoose = require('mongoose');
 
var ecomSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: {type:Number, default : 0.0},
    img:
    [{
        data: Buffer,
        contentType: String
    }],
    userId:{ type: Schema.Types.ObjectId, ref: 'User'},
    
});
 
//Image is a model which has a schema imageSchema
 
module.exports = new mongoose.model('Ecom', ecomSchema);