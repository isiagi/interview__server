import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

import express from "express";
import DB from './src/dbconfig';
import cookieParser from 'cookie-parser'


import Router from "./src/routers/userRouter"



const app = express();

DB()

const corsOptions = {
    origin: true, 
    credentials: true, 
};

app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

app.use('/api/v1', Router)


const Port = 5000;

app.listen(Port, () => {
    console.log(`Server Up And Running on Port ${Port}`);
});