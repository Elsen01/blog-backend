import express from 'express';
import multer from 'multer';

import mongoose from "mongoose";

mongoose.set('strictQuery', true);

import {registerValidation, loginValidation, postCreateValidation} from "./validation.js";

import {checkAuth, handleValidationErrors} from './utils/index.js';

import {UserController, PostController} from './controllers/index.js';


mongoose.connect('mongodb://localhost:27017/blog')
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB ERROR', err))

const app = express();
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({storage})

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/posts', PostController.getAll);
app.get('/post/:id', PostController.findOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/post/:id', checkAuth, PostController.remove);
app.put('/post/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(4000, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('Server run')
})