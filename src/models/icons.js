import mongoose from "mongoose"

const  {Schema,model}=mongoose;

const icons=new Schema({
    title:{
       type: String,
       required:true
    },
    image:{
        type:String,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        immutable:true
    }
})

const Icons= model("icons",icons);

export default Icons;

// module.exports=User;