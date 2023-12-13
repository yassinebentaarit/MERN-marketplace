import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const {username, email, password} = req.body;
  const hashPassword = bcrypt.hashSync(password,10);
  const newUser = new User({username, email, password:hashPassword});
  try{
    await newUser.save();
  }
  catch(error){
    res.status(500).json(error.message);
  }
  res.status(201).json('User created !!');
};