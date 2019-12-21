var express = require("express");
var router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

//@route POST api/users
//@desc User sign up
//@access Public
router.post(
  "/",
  [
    check("username", "Username is required")
      .not()
      .isEmpty(),
    check("email", "Must be a valid email").isEmail(),
    check("password", "Password must be at least 6 characters long.").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check if user exists
      let { username, email, password } = req.body;
      let user = await User.findOne({ email }).exec();
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      //Get user's gravatar
      let avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
      //Encrypt password
      user = new User({ username, email, password, avatar });
      let salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //Send json web token
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
