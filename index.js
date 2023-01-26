import express from 'express';
import mongoose from "mongoose";
mongoose.set('strictQuery', true);

import { registerValidation, loginValidation } from "./validation.js";

import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js'


mongoose.connect('mongodb://localhost:27017/blog')
    .then(()=>console.log('DB Ok'))
    .catch((err) => console.log('DB ERROR',err))

const app = express();

app.use(express.json())

app.get('/',(req,res) => {
    res.send('Hello world')
})

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation,UserController.register);
app.get('/auth/me', checkAuth,UserController.getMe);


app.listen(4000,(err)=> {
    if(err){
        console.log(err)
    }
    console.log('Server run')
} )