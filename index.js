import * as dotenv from 'dotenv'
dotenv.config()
const PORT= process.env.PORT || 5000
import express from "express"; 
import cors from 'cors'; 
import bodyParser from 'body-parser';
import dbConfig from "./src/config/index.js";
import userRouter from "./src/routes/userRoutes.js";
import docsRouter from "./src/routes/userDocs.js";
import iconRouter from './src/routes/iconRoutes.js';



const app=express();
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.use('/api/users',userRouter)
 app.use('/api/docs',docsRouter)
 app.use('/api/icons',iconRouter) 
// app.use('/api/messages',messageRouter)

// const generateEncryptionKey = () => {
//     return crypto.randomBytes(32).toString('hex');
//   };
  
//   // Exemple d'utilisation
//   const encryptionKey = generateEncryptionKey();
//   console.log('encrip',encryptionKey);


app.listen(PORT,()=>{
    dbConfig();
    console.log(`server is running on http://localhost:${PORT} `)
})