const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enums: ["entrepreneur", "investor"],
    required: true,
  },
  date: {
    type: Date,
  },
  companyname: {
    type: String,
  },
  designation: {
    type: String,
  },
  experience: {
    type: String,
  },
  educationdetails: {
    type: String,
  },
  description: {
    type: String,
  },
  wallet: {
    type: Number,
    default: 30,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
