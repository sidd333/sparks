
const Schema = require('mongoose').Schema;
 
var mongoose = require('mongoose');
 
var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    userId:{ type: Schema.Types.ObjectId, ref: 'User'},
    likes:{ type: Number , default: 0},
    likedby:[{ type: Schema.Types.ObjectId,ref: 'User' }],
    
},
{ timestamps: true });
 
//Image is a model which has a schema imageSchema
 
module.exports = new mongoose.model('Image', imageSchema);