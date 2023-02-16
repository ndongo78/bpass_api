import mongoose from "mongoose"
mongoose.set("strictQuery", false);
//connect db 
const dbConfig=()=>{
    mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bpass.3nmgoy2.mongodb.net/?retryWrites=true&w=majority`)
    .then((res)=>{
        console.log("Connect to the db")
    })
    .catch(err=>console.log("error",err))
}

export default dbConfig;