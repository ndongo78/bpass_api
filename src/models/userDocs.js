import mongoose from "mongoose"

const  {Schema,model}=mongoose;

const userDocs=new Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
    },
    titre:{
       type: String,
       required:true
    },
    lien:{
        type: String,
        default:null,
     },
    email:{
        type: String,
       required:true
    },
    password:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        default:null,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        immutable:true
    }
})

const UserDocs= model("userDocs",userDocs);

export default UserDocs;

// module.exports=User;