const express = require("express");
const router = express.Router();

const Goal = require("../models/Goal");

const authMiddleware = require("../middleware/authMiddleware");


// CREATE GOAL
// CREATE GOAL
router.post("/", authMiddleware, async (req, res) => {

  try {

    const {
      title,
      description,
      thrustArea,
      uom,
      target,
      weightage
    } = req.body;

    // Find existing user goals
    const existingGoals = await Goal.find({
      employeeId: req.user.id
    });

    // MAX 8 GOALS VALIDATION
    if (existingGoals.length >= 8) {
      return res.status(400).json({
        message: "Maximum 8 goals allowed"
      });
    }

    // MIN WEIGHTAGE VALIDATION
    if (weightage < 10) {
      return res.status(400).json({
        message: "Minimum weightage is 10%"
      });
    }

    // TOTAL WEIGHTAGE VALIDATION
    const totalWeightage = existingGoals.reduce(
      (sum, goal) => sum + goal.weightage,
      0
    );

    if (totalWeightage + weightage > 100) {
      return res.status(400).json({
        message: "Total weightage cannot exceed 100%"
      });
    }

    const goal = new Goal({
      title,
      description,
      thrustArea,
      uom,
      target,
      weightage,
      employeeId: req.user.id
    });

    await goal.save();

    res.status(201).json({
      message: "Goal Created",
      goal
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
// GET USER GOALS
router.get("/", authMiddleware, async (req, res) => {

  try {

    const goals = await Goal.find({
      employeeId: req.user.id
    });

    res.status(200).json(goals);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
// MANAGER - GET ALL GOALS
router.get("/all", authMiddleware, async (req, res) => {

  try {

    // Check manager role
    if (req.user.role !== "manager") {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    const goals = await Goal.find().populate("employeeId", "name email");

    res.status(200).json(goals);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
// MANAGER APPROVE GOAL
router.patch("/approve/:id", authMiddleware, async (req, res) => {

  try {

    // Only managers allowed
    if (req.user.role !== "manager") {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved"
      },
      { new: true }
    );

    res.status(200).json({
      message: "Goal Approved",
      goal
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
// EMPLOYEE UPDATE ACHIEVEMENT
router.patch("/update/:id", authMiddleware, async (req, res) => {

  try {

    const {
      actualAchievement,
      checkInStatus
    } = req.body;

    const goal = await Goal.findById(req.params.id);

    // Ensure employee owns goal
    if (goal.employeeId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    // Update fields
    goal.actualAchievement = actualAchievement;

    goal.checkInStatus = checkInStatus;

    // AUTO PROGRESS CALCULATION
    goal.progress = Math.min(
      (actualAchievement / goal.target) * 100,
      100
    );

    await goal.save();

    res.status(200).json({
      message: "Achievement Updated",
      goal
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
// MANAGER ADD COMMENT
router.patch("/comment/:id", authMiddleware, async (req, res) => {

  try {

    // Only managers allowed
    if (req.user.role !== "manager") {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    const { managerComment } = req.body;

    const goal = await Goal.findById(req.params.id);

    goal.managerComment = managerComment;

    await goal.save();

    res.status(200).json({
      message: "Comment Added",
      goal
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
// ADMIN UNLOCK GOAL
router.patch("/unlock/:id", authMiddleware, async (req, res) => {

  try {

    // Only manager/admin
    if (req.user.role !== "manager") {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    const goal = await Goal.findById(req.params.id);

    goal.status = "pending";

    await goal.save();

    res.status(200).json({
      message: "Goal Unlocked",
      goal
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
module.exports = router;