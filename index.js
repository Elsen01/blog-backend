import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
mongoose.set('strictQuery', true);
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";


mongoose.connect('mongodb+srv://admin:admin@cluster0.s5yqh.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>console.log('DB Ok'))
    .catch((err) => console.log('DB ERROR',err))

const app = express();

app.use(express.json())

app.get('/',(req,res) => {
    res.send('Hello world')
})

app.post('/auth/register', registerValidation,(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.status(400).json(errors.array())
    }
    res.json({
        success: true,
    })
})



app.listen(4000,(err)=> {
    if(err){
        console.log(err)
    }
    console.log('Server run')
} )