
import express from "express"
import generatorToken from "../middlewares/generateToken.js";
import bcryt from "bcrypt"
import User from "../models/users.js";
import authMildware from "../middlewares/auth.js";
import CryptoJS from "crypto-js";

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
        const {password,isAdmin,counterLog,codeSecret,__v,...others} =user._doc;
        const token=await generatorToken(others);
        return res.status(200).json({token:token})
        
    } catch (error) { 
        return res.status(500).json(error)
    }
})

//get all users
// userRouter.get("/",authMildware ,async(req,res)=>{
//     try {
//         const users=await User.find();
//         if(users){
//             return res.status(200).json(users)
//         }else{
//             return res.status(404).json({message:'Une erreur est survenue'});
//         }
        
//     } catch (error) {
//         return res.status(500).json(error)
//     }
// })
//
userRouter.get('/me',authMildware ,async(req,res,)=>{ 
    try {
        const users=await User.findById(req.user.user._id)
        
        
        if(users.codeSecret == 0){
            return res.status(200).json({message:"Not completed"})
        }
        
    } catch (error) {
        return res.status(500).json(error)
    }
})

// //get  users details
// userRouter.get("/me",authMildware ,async(req,res)=>{
//     //console.log(req.user.user._id)
//     try {
//         const users=await User.findById(req.user.user._id).populate("friendIn").populate("friendOut")
//         if(users){
//             return res.status(200).json(users)
//         }else{
//             return res.status(404).json({message:'Une erreur est survenue'});
//         }
        
//     } catch (error) {
//         return res.status(500).json(error)
//     }
// })
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
//verification code
userRouter.post("/verification",authMildware,async(req,res)=>{
    

    // const codeDecrypted= CryptoJS.AES.decrypt(req.body.codeSecret,process.env.SECRETKEY).toString()
    // console.log("reqbody",CryptoJS.AES.decrypt(req.body.codeSecret,process.env.SECRETKEY))
    try {
        const user= await User.findOne({_id:req.user.user._id})
        const codeSenderDecrypteds= CryptoJS.AES.decrypt(req.body.codeSecret, process.env.SECRETKEY).toString(
            CryptoJS.enc.Utf8)
        const codeSaveDecrypted=CryptoJS.AES.decrypt(user.codeSecret, process.env.SECRETKEY).toString(
            CryptoJS.enc.Utf8)
         if(codeSaveDecrypted !== codeSenderDecrypteds){
            user.numTriesCode++;
            await user.save();
            //return res.status(401).json({message:"Code secret incorrect"})

            if (user.numTriesCode >= 3) {
                // Lock user account
                user.locked = true;
                await user.save();
                return res.status(401).json({ error: 'Votre compte est bloqué cause de plusieurs tentatives' });
              }
              return res.status(401).json({ error: 'Incorrect code. ' + (3 - user.numTries) + 'tentatives restant' });
         }
         else{
            user.numTriesCode = 0;
            await user.save();

            res.json({message: "success"});
         }
        } catch (error) {
        //console.log(error)
        return res.status(500).json(error)
    }
})
export default userRouter;