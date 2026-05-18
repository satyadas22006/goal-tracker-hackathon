const express = require("express");
const router = express.Router();
console.log("Auth Routes Loaded");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});
router.post("/register", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
     name,
     email,
     password: hashedPassword,
      role
    });
    

    await user.save();

    res.status(201).json({
      message: "User Registered",
      user
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

   const token = jwt.sign(
    {
        //payload
      id: user._id,
      role: user.role
    },
    "secretkey",
     {
      expiresIn: "1d"
        //token expires in 1 day
    }
    );

    res.status(200).json({
        message: "Login Successful",
        token,
        user
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
router.get("/profile", authMiddleware, async (req, res) => {

  res.status(200).json({
    message: "Protected Profile Route",
    user: req.user
  });

});
module.exports = router;