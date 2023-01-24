import {body} from "express-validator";


 export const registerValidation = [
    body('email').isEmail().isLength({ min: 5 }),
    body('password').isLength({ min: 3 }),
    body('fullName').isLength({ min: 3 }),
    body('avatarUrl').optional().isURL(),
];