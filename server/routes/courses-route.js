const req = require("express/lib/request");

const router = require("express").Router();
const Course = require("../models/index").courseModel;
const User = require("../models/index").userModel;
const courseValidation = require("../validation").courseValidation;

// middleware
router.use((req, res, next) => {
  console.log("A request is coming in to course-route.js");
  next();
});

// route
router.get("/", (req, res) => {
  Course.find({})
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("Error!! Cannot get course!!");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post("/", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check role
  let { title, description, price } = req.body;
  if (req.user.isStudent()) {
    return res.status(400).send("Only instructor can post a course.");
  }

  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });
  try {
    await newCourse.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("User not saved.");
  }
});

router.patch("/:_id", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id });

  // check if course exist
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course not found.",
    });
  }

  // check authorization of course
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course updated.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the instructor of this course or web admin can edit this course.",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });

  // check if course exist
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course not found.",
    });
  }

  // check authorization of course
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course deleted.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the instructor of this course or web admin can delete this course.",
    });
  }
});

module.exports = router;
