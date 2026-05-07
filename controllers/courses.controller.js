
const { body, validationResult } = require('express-validator');
const { Course } = require('../models/course.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleWare/asyncWrapper');
const APPError = require('../utils/appError');

const getAllCourses = asyncWrapper(async (req, res) => {
  const query= req.query;
  console.log(query);
  const limit = query.limit ;
  const page = parseInt(query.page) ;
  const courses = await Course.find().limit(limit).skip((page - 1) * limit);
  res.json({ status: httpStatusText.SUCCESS, data: { courses } });

});

const getCourse = asyncWrapper(async (req, res,next) => {
    const course = await Course.findById(req.params.id);
  if (!course) {

      const err = APPError.createError(404, 'Course not found', httpStatusText.FAIL);
   return  next(err);
    
  }
    res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const addCourse = asyncWrapper(async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = APPError.createError(400, errors.array(), httpStatusText.FAIL);
    return next(err);
  }

  const course = await Course.create(req.body)
    .then(course => res.status(201).json({ status: httpStatusText.SUCCESS, data: { course } }))

});


const updateCourse = asyncWrapper(async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(course => {
      if (!course) return res.status(404).json({ status: httpStatusText.FAIL, data: null, message: 'Course not found' });
      res.json({ status: httpStatusText.SUCCESS, data: { course } });
    })

});
const deleteCourse = asyncWrapper(async (req, res,next) => {
  await Course.findByIdAndDelete(req.params.id)
    .then(course => {
      if (!course) {
        const err = APPError.createError(404, 'Course not found', httpStatusText.FAIL);
        return next(err);
      }
      res.json({ status: httpStatusText.SUCCESS, data: null });
    })
});

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
}
