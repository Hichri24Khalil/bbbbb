import dotenv from 'dotenv';
dotenv.config();


import express from "express" ;
import cors from "cors";
import morgan from 'morgan';

import productRouter from './routers/product.router'
import userRouter from "./routers/user.router";
import { dbConnect } from './configs/database.config';
const path = require('path');

dbConnect();

const app =express(); 
app.use(express.json());
app.use(morgan('tiny'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use (cors({
    credentials:true,
    origin:["http://localhost:3000"]
}));
 
app.use("/api/products",productRouter);
app.use("/api/users",userRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
   console.log("Website served on http://localhost:" + port);
})