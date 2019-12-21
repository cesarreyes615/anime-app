const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Favorite = require("../../models/Favorite");
const { check, validationResult } = require("express-validator");

//@route POST api/favorites
//@desc Create a favorite post and associate it with a user
//@access Private
router.post("/", auth, async (req, res) => {
  let { title, episodes, image, synopsis } = req.body;
  try {
    let favorite = await Favorite.findOne({ user: req.user.id, title });
    if (favorite) {
      return res
        .status(400)
        .json({ msg: "This title has already been favorited" });
    }
    favorite = new Favorite({
      user: req.user.id,
      title,
      episodes,
      image,
      synopsis
    });

    await favorite.save();
    res.json(favorite);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route GET api/favorites/all
//@desc Get all favorite anime for a single user
//@access Private
router.get("/all", auth, async (req, res) => {
  try {
    let favorites = await Favorite.find({ user: req.user.id });
    return res.json(favorites);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route POST api/favorites/deleteOne
//@desc Delete one favorite anime from the user
//@access Private
router.post("/deleteOne", auth, async (req, res) => {
  try {
    let { title } = req.body;
    await Favorite.findOneAndDelete({ user: req.user.id, title });
    res.send("Deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
