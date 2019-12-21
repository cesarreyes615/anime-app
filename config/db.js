const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoConnection");

const connectDB = async function() {
  try {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("MongoDB connection pending...");
    mongoose.connection
      .on("error", console.error.bind(console, "connection error:"))
      .once("open", () => {
        console.log("MongoDB successfully connected");
      });
  } catch (err) {
    console.log(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
