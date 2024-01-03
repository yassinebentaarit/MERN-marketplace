import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const {username, fullname, num, dateNaissance,  email, password} = req.body;
  const hashPassword = bcrypt.hashSync(password,10);
  const newUser = new User({username:username, fullname:fullname, num:num, dateNaissance:dateNaissance, email:email, password:hashPassword});
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

export const google = async ( req, res , next ) => {
  try {
    const user = await User.findOne({email: req.body.email})
    if (user) {
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const { password: pass, ...rest} = user._doc;
      res
        .cookie('access_token', token, {httpOnly: true })
        .status(200)
        .json(rest);

    } else{
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword,10);
      const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() +Math.random().toString(36).slice(-4),
        email: req.body.email, 
        password: hashedPassword, 
        num: req.body.num !== undefined ? req.body.num : null,
        avatar: req.body.photo,
      })
      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
      const { password: pass, ...rest} = newUser._doc;
      res
        .cookie('access_token', token , {httpOnly: true})
        .status(200)
        .json(rest);
    }
  } catch (error){
    console.log(error)
  }
}
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
}