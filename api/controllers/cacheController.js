
const mongoose = require('mongoose');
const Cache = require('../models/cacheModel');

function makeCacheKey() {
    let ckey = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++){
        ckey += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return ckey;
  }
  
 
exports.createCache = (req,res,next) =>{
    createCatche(req,res,next,0);
}

exports.getCache = (req,res,next) =>{
    Cache.findOne({cache_key:req.params.key})
    .select("cache_key cache_value _id ")
    .exec()
    .then(doc =>{
        if(doc === null){
            createCatche(req,res,next,1)
        }else{
        res.status(200).json({
            Status :200,
            Message  : 'Cache hit',
            createdCache:{
                cacheId : doc._id,
                cacheValue : doc.cache_value,
                cacheKey : doc.cache_key,
            },
            request :{
                type : 'GET',
                url :'http://localhost:3000/cache/'
            }
        })
    }
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        });
    });
}

exports.getAllCache = (req,res,next) =>{
    Cache.find()
    .select("cache_key cache_value _id ")
    .exec()
    .then(docs =>{
        if(docs.length > 0 ){
            res.status(200).json({
                Status :200,
                Count:docs.length,
                Caches : docs.map(doc => {
                    return {
                        cacheId : doc._id,
                        cacheKey : doc.cache_key,
                        cacheValue : doc.cache_value,
                        request :{
                            type : 'GET',
                            url :'http://localhost:3000/cache/getcache/'+ doc.cache_key
                        }
                    }
                }),
            })
        }else{
            res.status(200).json({
                Status : 200,
                Count:docs.length,
                message : " No Caches Found"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        });
    });
}


exports.updateCacheData = (req,res,next) =>{
    Cache.updateOne({cache_key:req.params.key},{cache_value:req.body.cacheValue},(err,result)=>{
        if(result.nModified === 1){
            return res.status(200).json({
                status : 200,
                message : "Cache Value Update Successfully",
                request :{
                    type : 'GET',
                    url :'http://localhost:3000/cache/getcache/'+ req.params.key
                }
            })
        }else{
            return res.status(404).json({
                Status :404,
                message : "Cache Key Not Found"
            });
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });
}


exports.deleteCacheData = (req,res,next) =>{
    Cache.remove({cache_key:req.params.key})
        .exec()
        .then(result => {
            if(result.n == 1){
               return  res.status(200).json({
                    status: 200,
                    message:"CacheKey : " + req.params.key + " ,Deleted Successfully",
                });
            }else{
                return  res.status(404).json({
                    status: 404,
                    message:"Cache Not Found"
                });
            }
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            });
        });
}


exports.deleteAllCacheData = function(req, res, next) {
    Cache.remove({})
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            message:"Cache Deleted Successfully"
        });
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        });
    });
};

function generateRandomKeyAndInsert(req,res,next) {
    const cache = new Cache({
        _id: new mongoose.Types.ObjectId(),
        cache_key:makeCacheKey(),
        cache_value : "some test value for random cache key",
    });
    cache
    .save()
    .then(cacheData=>{
        res.status(201).json({
            status : 201,
            message :'Cache Created Successfully',
            createdCache:{
                cacheId : cacheData._id,
                cacheValue : cacheData.cache_value,
                cacheKey : cacheData.cache_key,
            },
            request :{
                type : 'GET',
                url :'http://localhost:3000/cache/getcache/'+ cacheData.cache_key
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    })
  }


function createCatche(req,res,next,randomCreate){

    let msg  = (randomCreate === 1) ? 'Cache miss': 'Cache Created Successfully';
    const cache = new Cache({
        _id: new mongoose.Types.ObjectId(),
        cache_key:makeCacheKey(),
        cache_value : "some cache value for random cache key",
    });
    cache
    .save()
    .then(cacheData=>{
        res.status(201).json({
            status : 201,
            message : msg,
            createdCache:{
                cacheId : cacheData._id,
                cacheValue : cacheData.cache_value,
                cacheKey : cacheData.cache_key,
            },
            request :{
                type : 'GET',
                url :'http://localhost:3000/cache/getcache/'+ cacheData.cache_key
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    })
}
