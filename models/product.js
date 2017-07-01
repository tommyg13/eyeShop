var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    url: {type: String, required: true},
    brand: {type: String, required: true},
    model: {type:String,required:true},
    description:{type:String,required:true},
    photos: {type:Array,default:[],required:true},
    gender: {type: String, required: true},
    type: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Product', schema);