const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CacheSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    cache_key:{
        type:String,
        required: [true, "can't be blank"]
    },
    cache_value:{
        type: String,
        required: [true, "can't be blank"]
    },  
}, 
{timestamps: true},);

const Caches = mongoose.model('Cache', CacheSchema);

module.exports =  Caches;