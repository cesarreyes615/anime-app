const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unqiue: true },
  password: { type: String, required: true },
  avatar: { type: String },
  date: { type: Date, default: Date.now }
});

let User = mongoose.model("users", userSchema);
module.exports = User;
