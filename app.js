//pass= eoaq5Z0HAjNFL2BL
const express = require( 'express');
const mongoose = require( 'mongoose');

const app = express();

//Middleware
app.use ("/", (req, res, next) => {
    res.send("It is working!");
})

mongoose.connect('mongodb+srv://nimesh105c2:eoaq5Z0HAjNFL2BL@cluster0.pipiscn.mongodb.net/')
.then(() => console.log("connected to MongoDB"))
.then(() => {
    app.listen(5000)
    })
    
.catch((err) => console.log(err));