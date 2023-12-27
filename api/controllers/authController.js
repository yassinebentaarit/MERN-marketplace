import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const {username, nom, prenom, num, dateNaissance,  email, password} = req.body;
  const hashPassword = bcrypt.hashSync(password,10);
  const newUser = new User({username:username, nom:nom, prenom:prenom, num:num, dateNaissance:dateNaissance, email:email, password:hashPassword});
  console.log(newUser)

  try{
    await newUser.save();
    res.status(201).json('User created !!');
  }
  catch(error){
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcrypt.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
    const {password: pass, ...rest} = validUser._doc;
    res
      .cookie('access_token', token ,{httpOnly:true , expires: new Date(Date.now()+30*24*60*60*1000)})
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
}