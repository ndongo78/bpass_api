import express from "express";
import authMildware from "../middlewares/auth";
import UserDocs from "../models/userDocs";


const docsRouter=express.Router()


//get user docs
docsRouter.get('/',authMildware,async(req,res)=>{
    try {
       const docs= await UserDocs.find({userId:req.user.user._id})
       return res.json(docs)
    } catch (error) {
        return res.status(500).json(error)
    }
})


//create docs
docsRouter.post('/',authMildware,async(req,res)=>{
    try {
            const docs= new UserDocs(req.body); 
            await docs.save();
            return res.status(200).json(docs)
    } catch (error) {
        return res.status(500).json(error)
    }
})

//update docs
docsRouter.put('/:id',authMildware,async(req,res)=>{
    try {
        const docs = await UserDocs.findByIdAndUpdate(req.params.id,{$set:req.body})
        return res.status(200).json(docs)
    } catch (error) {
        return res.status(500).json(error)
    }
})

//delete docs
docsRouter.delete('/:id',authMildware,async(req,res)=>{
    try {
      await UserDocs.findByIdAndDelete(req.params.id)
        return res.status(200).json({message:"Le document est supprimé avec  succès"})
    } catch (error) {
        return res.status(500).json(error)
    }
})

export default docsRouter