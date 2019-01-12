const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('./api/db/dbconnection');
const cacheRoutes = require('./api/routes/cacheRouts');

app.use(cors())
app.use((req,res,next) => {
    res.header("Access-Controll-Allow-Origin",'*');
    res.header(
        "Access-Controll-Allow-Headers",
        "Origin,X-Requested-With,Content_Type,Accept,Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Controll-Allow-Method','PUT,POST,GET,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
})

app.use(express.json());
app.use('/cache',cacheRoutes);
app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404 ;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            status: error.status ,
            message : error.message 
        }
    })
});
module.exports = app;