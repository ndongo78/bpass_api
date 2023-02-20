import mongoose from "mongoose"

const  {Schema,model}=mongoose;

const users=new Schema({
    firstName:{
        type:String,
        validate:{
          validator:(value)=>{
            if(!value){
              message: (props)=>`${props.value} ne peut pas etre null `
            }
          },
        },
    },
    lastName:{
        type:String,
        validate:{
          validator:(value)=>{
            if(!value){
              message: (props)=>`${props.value} ne peut pas etre null `
            }
          },
        },
    },
    email:{
        type:String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    password:{ 
        type:String,
        required:true,
        validate:{
            validator:(value) =>{
            if(!value){
                message: (props)=>`${props.value} ne peut pas etre null `
                }
            },
        },
        minlength: 8,
    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    codeSecret:{ 
        type:String,
        default: 0,
    },
    counterLog:{
        type: String,
        default: 3,
    },
    numTriesCode: { type: Number, default: 0 },
    locked:{
      type:Boolean,
      default: false
  }

},
{timestamps:true}
)

const User= model("User",users);

export default User;

// module.exports=User;