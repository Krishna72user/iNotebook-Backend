import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const fetchuser = (req,res,next)=>{
    try {
        const authtoken=req.headers['authtoken']
        if(authtoken){
            const decoded = jwt.verify(authtoken, process.env.SECRET)
            req.id = decoded.id
            next();
        }
        else{
            res.status(401).send('Token is missing.')
        }
    } catch (error) {
        res.status(401).send("Please enter a valid auth token.")
    }
}
