import express from "express";
import Icons from "../models/icons.js";
import authMildware from "../middlewares/auth.js";

const iconRouter = express.Router()


//get user docs
iconRouter.get('/', authMildware, async (req, res) => {
    try {
        const docs = await Icons.find()
        return res.json(docs)
    } catch (error) {
        return res.status(500).json(error)
    }
})


//create docs
iconRouter.post('/', authMildware, async (req, res) => {

    await Icons.create(req.body,function(error,result){
        if (error){
            return res.status(500).json(error)
        }else{
           // console.log(result)
            return res.status(201).json(result)
        }
    })
})

export default iconRouter