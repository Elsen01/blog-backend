import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
mongoose.set('strictQuery', true);


mongoose.connect('mongodb+srv://admin:admin@cluster0.s5yqh.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>console.log('DB Ok'))
    .catch((err) => console.log('DB ERROR',err))

const app = express();

app.use(express.json())

app.get('/',(req,res) => {
    res.send('Hello world')
})

app.post('/auth/login',(req,res) => {
    console.log(req.body)

    const token = jwt.sign({
        email: req.body.email,
        fullName: 'Elsen askerov'
    },'secret123',
        )


    res.json({
        success: true,
        token,
    })
})



app.listen(4000,(err)=> {
    if(err){
        console.log(err)
    }
    console.log('Server run')
} )