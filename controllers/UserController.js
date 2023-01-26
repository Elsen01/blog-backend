import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModule from "../models/User.js";

export const register = async (req,res) => {
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
}

export const login = async (req,res) => {
    try{
        const user = await UserModule.findOne({ email: req.body.email })

        if (!user){
            return res.status(404).json({
                message: 'User Not Found'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password,user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Email or Password Failed',
            })
        }

        const token = await jwt.sign({
                _id: user._id,
            },'secret123',
            {
                expiresIn: '1h',
            })

        const { passwordHash, ...UserData } = user._doc

        res.json({
            ...UserData,
            token,
        })


    }catch (err){
        res.status(500).json({
            message: 'Email or Password Failed'
        })
    }
};

export const getMe = async (req,res) => {
    try {
        const user = await UserModule.findById(req.userId);

        if (!user){
            return  res.status(404).json({
                message: 'User Not Found'
            });
        }

        const { passwordHash, ...userData} =user._doc
        res.json(userData)

    }catch (err){
        console.log(err);
        res.status(404).json({
            message: 'No Input'
        })
    }
}