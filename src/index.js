import * as dotenv from 'dotenv'
dotenv.config()
const PORT= process.env.PORT || 5000
import express from "express"; 
import cors from 'cors'; 
import dbConfig from "./config/index.js";
import userRouter from "./routes/userRoutes.js";
import docsRouter from "./routes/userDocs.js";



const app=express();
app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.use('/api/users',userRouter)
 app.use('/api/docs',docsRouter)
// app.use('/api/messages',messageRouter)


app.listen(PORT,()=>{
    dbConfig();
    console.log(`server is running on http://localhost:${PORT} `)
})