import express from 'express'
import { Notes } from '../models/Notes.js';
import {fetchuser} from '../middleware/fetchUser.js'
import {body,validationResult} from 'express-validator'
const router = express.Router()

// GEt localhost:3000/notes/fetchAllnotes
router.get('/fetchAllnotes',fetchuser,async (req,res)=>{
    try{
        const data = await Notes.find({user:req.id})
        res.json(data)
    }
    catch(err){
        res.status(500).send('Internal server error.')
    }
})


// POST localhost:3000/notes/addnote
router.post('/addnote',fetchuser,[
    body('title').isLength({min:5}).withMessage('Title is too short.'),
    body('description').isLength({min:7}).withMessage('Description is too short.'),
] ,async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json(errors)
    }
    else{
        try {
            const note = new Notes({user:req.id,title:req.body.title,description:req.body.description,tag:req.body.tag})
            await note.save()
            res.json(note)
        } catch (error) {
            res.status(500).send(error)
        }
    }
})


//PUT localhost:3000/notes/updatenote/:id
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try{
        const obj = await Notes.findOne({_id:req.params.id})
        let Updnote={
            title:req.body.title?req.body.title:obj.title,
            description:req.body.description?req.body.description:obj.description,
            tag: req.body.tag?req.body.tag:obj.tag
        }
        const note =await Notes.findOneAndUpdate({user:req.id,_id:req.params.id},Updnote,{new:true})
        res.json(note)
    }catch(error){
        res.status(500).send(error)
        console.error(error)
    }
})


//DELETE localhost:3000/notes/deletenote/:id
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try{
        const note =await Notes.deleteOne({user:req.id,_id:req.params.id})
        res.json(note)
    }catch(error){
        res.status(500).send(error)
        console.error(error)
    }
})

export default router