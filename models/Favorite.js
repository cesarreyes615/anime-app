const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let favoriteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  title: { type: String },
  episodes: { type: String },
  image: { type: String },
  synopsis: { type: String }
});

module.exports = Favorite = mongoose.model("favorite", favoriteSchema);
