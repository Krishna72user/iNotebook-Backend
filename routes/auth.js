import express from 'express'
import {body,validationResult} from 'express-validator'
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import {fetchuser} from '../middleware/fetchUser.js'
import dotenv from 'dotenv'
dotenv.config()
const router = express.Router();

//Endpoint : POST localhost:3000/auth/register
router.post('/register',
    [// Using express validator
        body('name').isLength({min:4}).withMessage('Name must be 4 characters long.'),
        body('password').isLength({min:5}).withMessage('Too weak or no spaces allowed.'),
        body('email').isEmail().withMessage('Not an email.')
    ],
    async (req,res)=>{
    let success =false;
    let exists = false;
    const errors = validationResult(req);
    // Errors will empty if there is no error thrown by express validator.
    if(!errors.isEmpty()){
       return res.status(400).json({errors,success})//Return is using for stop furthur execution.
    }
    try{
        success = true
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password,salt)
        const user_email = await User.findOne({email:req.body.email})
        if(user_email){
            exists=true
            return res.status(400).json({Message:"A user with the same email already exists.",success,exists})
        }
        const user = new User({'name':req.body.name,'password':hash,'email':req.body.email})
        await user.save()
        const payload = {
            id:user._id
        }
        
        const auth_token = jwt.sign(payload,process.env.SECRET)
        res.json({'authToken':auth_token,success}) //When a user registers he will recieve a auth token.
    }catch(err){
        console.error(err)
        res.status(500).json({"msg":'Some error occured.',success})
    }
})



//Endpoint: POST localhost:3000/auth/login
router.post('/login',
    [// Using express validator
        body('password').isLength({min:5}).withMessage('Too weak or no spaces allowed.'),
        body('email').isEmail().withMessage('Not an email.')
    ],
    async (req,res)=>{
        const errors = validationResult(req);
        let success = false;
        // Errors will empty if there is no error thrown by express validator.
        if(!errors.isEmpty()){
           return res.status(400).json({errors})//Return is using for stop furthur execution.
        }
        
        try {
            const user = await User.findOne({email:req.body.email});
            if(user){
                success=true;
                let x = await  bcrypt.compare(req.body.password,user.password);
                if(x){
                    const payload = {
                        id:user._id
                    }
                    
                    const auth_token = jwt.sign(payload,process.env.SECRET)
                    return res.json({'authToken':auth_token,success}) //When a user logs in he will recieve a auth token.
                }
                else{
                    success=false
                   return res.status(400).json({msg:'Please enter valid credentials.',success})
                }
            }
            else{
                success=false;
                return res.status(400).json({msg:'Please enter valid credentials.',success})
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Internal server error.')
        }
    }
)


//Get user details :  GET localhost:3000/auth/getUser.Login required.
router.get('/getUser',fetchuser, async (req,res)=>{
    try{
        const userId = req.id;
        if(userId){
            const data= await User.findById(userId)
            res.json(data)
        }
    }catch (error) {
        console.error(error)
        res.status(500).send('Internal server error.')
    }
})
export default router;