import express, { urlencoded } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import dalleRoutes from './routes/dalleRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(urlencoded({extended:true}))
app.use(express.json({limit: '50mb'}));


app.use('/api/v1/post',postRoutes);
app.use('/api/v1/dalle',dalleRoutes);

app.get('/', async (req,res) =>{
    res.send("Hello from DALL-E!");
}) 

const startServer = () =>{
   try{
// connectDB is a method to connect with database atlas
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, ()=> console.log("Server has started on port http://localhost:8080"));
   }
   catch(err){
    console.log(err);
   }
}

startServer();

