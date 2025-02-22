import express from 'express'
import con from './db.js'
import auth from './routes/auth.js'
import  notes  from './routes/notes.js';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
con();
console.log(process.env.SECRET)


const app = express()
app.use(cors())
app.use(express.json())
app.use('/auth',auth);
app.use('/notes',notes)

app.get('/',(req,res)=>{
    res.send("Hello world")
})
app.listen(3000,(req,res)=>{
    console.log('http://localhost:3000')
})