import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_ATLAS)
  .then(() => {
    console.log('Connected to Mongo ');
  })
  .catch((err) => { 
    console.log(err)
  });

const app = express();
app.listen(4044, () => {
  console.log('Server is running on port 4044');
});
app.locals