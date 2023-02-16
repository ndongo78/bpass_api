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
        required:true,
        unique:true,
        validate:{
            validator:(value) =>{
            if(!value){
                message: (props)=>`${props.value} ne peut pas etre null `
                }
            }
        }
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
    code:{ 
        type:String,
        validate:{
            validator:(value) =>{
            if(!value){
                message: (props)=>`${props.value} ne peut pas etre null `
                }
            },
        },
        minlength: 4,
    }

},
{timestamps:true}
)

const User= model("User",users);

export default User;

// module.exports=User;