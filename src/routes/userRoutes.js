
import express from "express"
import generatorToken from "../middlewares/generateToken.js";
import bcryt from "bcrypt"
import User from "../models/users.js";
import authMildware from "../middlewares/auth.js";


const userRouter=express.Router()

//register
userRouter.post("/",async(req,res)=>{
    req.body.password = await bcryt.hash(req.body.password,10)
    await User.create(req.body,function(error,result){
        if (error){
            if(error.code === 11000){
                return res.status(500).json("L'address email exist déja")
            }
            return res.status(500).json(error)
        }else{
            console.log(result)
            return res.status(201).json(result)
        }
    })
})

//login
userRouter.post('/login',async(req,res)=>{ 
    try {
        const user= await User.findOne({
            email:req.body.email
        })

        if(!user){
            return res.status(400).json('Identifiant ou mot de passe incorrect');
        }
        const isValid=await bcryt.compare(req.body.password,user.password);
        if(!isValid){
            return res.status(400).json('Identifiant ou mot de passe incorrect');
        }
        const {password,isAdmin,__v,...others} =user._doc;
        const token=await generatorToken(others);
        return res.status(200).json({token:token})
        
    } catch (error) { 
        return res.status(500).json(error)
    }
})

//get all users
userRouter.get("/",authMildware ,async(req,res)=>{
    try {
        const users=await User.find();
        if(users){
            return res.status(200).json(users)
        }else{
            return res.status(404).json({message:'Une erreur est survenue'});
        }
        
    } catch (error) {
        return res.status(500).json(error)
    }
})

//get  users details
userRouter.get("/me",authMildware ,async(req,res)=>{
    //console.log(req.user.user._id)
    try {
        const users=await User.findById(req.user.user._id).populate("friendIn").populate("friendOut")
        if(users){
            return res.status(200).json(users)
        }else{
            return res.status(404).json({message:'Une erreur est survenue'});
        }
        
    } catch (error) {
        return res.status(500).json(error)
    }
})
//update info
userRouter.put('/:id',authMildware, async (req , res,)=>{ 
   try {
    if(req.user.user._id === req.params.id ){
        if(req.body.password){
           try {
            req.body.password = await bcryt.hash(req.body.password,10)
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body})
            const {password,isAdmin,_v,...others} =user._doc;
            return res.status(200).json(others)
           } catch (error) {
            return res.status(500).json(error)
           }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body})
            const {password,isAdmin,_v,...others} =user._doc;
            return res.status(200).json(others)
           } catch (error) {
            return res.status(500).json(error)
           }
    }else{
        return res.status(401).json({message:"Accés refusé"})
    }
   } catch (error) {
    return res.status(500).json(error)
   }
})

//add followIn
userRouter.put('/:id/followIn',authMildware, async (req , res,)=>{ 
    // console.log("first",req.user.user)
    // console.log("scon",req.params)
    try {
        if(req.user.user._id === req.params.id ){
            if(req.params.id === req.body.userId ) return res.status(401).json({message:"Vous ne pouvez pas vous s'abonné a vous méme"})
            try {
             const user = await User.findById(req.params.id)
             const currentUser = await User.findById(req.body.userId)
             const exist= await user.friendIn.includes(req.body.userId)
             if(exist){
                return res.status(403).json({message:"Vous etes déja abonné a cet utilisateur"})
             }else{
                 await user.updateOne({$push: {friendIn:req.body.userId}})
                 await currentUser.updateOne({$push: {friendOut:req.params.id}})
                 return res.status(200).json({message: `${currentUser.username} est ajouté à votre liste d'abonnés` })
             }
            } catch (error) {
             return res.status(500).json(error)
            }
     }else{
         return res.status(401).json({message:"Vous n'etes pas autorisé a effectué cette operation"})
         
     }
    } catch (error) {
     return res.status(500).json(error)
    }
 })
//remove  friend
userRouter.put('/:id/unfollow',authMildware, async (req , res,)=>{ 
    try {
        if(req.user.user._id === req.params.id ){
            if(req.params.id === req.body.userId ) return res.status(403).json({message:"Vous ne pouvez pas vous s'abonné a vous méme"})
            try {
             const user = await User.findById(req.params.id)
             const currentUser = await User.findById(req.body.userId)
             const exist= await user.friendIn.includes(req.body.userId)
             if(exist){
                await user.updateOne({$pull: {friendIn:req.body.userId}})
                await currentUser.updateOne({$pull: {friendOut:req.params.id}})
                return res.status(200).json({message: `${currentUser.username} a été retirer de la liste d'abonnés` })
             }else{
                return res.status(404).json({message:"Vous n'etes pas abonné a cet utilisateur"})
             }
            } catch (error) {
             return res.status(500).json(error)
            }
     }else{
         return res.status(401).json({message:"Vous n'etes pas autorisé a effectué cette operation"})
     }
    } catch (error) {
     return res.status(500).json(error)
    }
 })
export default userRouter;