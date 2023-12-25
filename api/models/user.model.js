import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type:String,
    require:true,
    unique: true
  },
  nom: {
    type:String,
    require:true,
  },
  prenom: {
    type:String,
    require:true,
  },
  num: {
    type:Number,
    default: null
  },
  dateNaissance:{
    type:Date,
    require:true
  },
  email: {
    type:String,
    require:true,
    unique: true
  },
  password: {
    type:String,
    require:true
  },
},{timestamps:true});

const User = mongoose.model('User', userSchema);

export default User; 