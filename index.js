import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt, {hash} from 'bcrypt';
import mongoose from "mongoose";
mongoose.set('strictQuery', true);
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModule from './models/User.js'


mongoose.connect('mongodb://localhost:27017/blog')
    .then(()=>console.log('DB Ok'))
    .catch((err) => console.log('DB ERROjR',err))

const app = express();

app.use(express.json())

app.get('/',(req,res) => {
    res.send('Hello world')
})

app.post('/auth/register', registerValidation,async (req,res) => {
    try{const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array())
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);

        const doc = new UserModule({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        },'secret123',
            {
                expiresIn: '1h',
            })

        const {passwordHash, ...userData } = user._doc
        res.json({
            ...userData,
            token,
        })

    } catch (err){
        console.log(err)
        res.status(500).json({
            message: 'registration failed',
        })
    }
});


app.listen(4000,(err)=> {
    if(err){
        console.log(err)
    }
    console.log('Server run')
} )