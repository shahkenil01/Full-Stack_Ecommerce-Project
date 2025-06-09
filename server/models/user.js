const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true, 
    unique:true
  },
  email:{
    type:String,
    required:true, 
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client'
  }
})

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;