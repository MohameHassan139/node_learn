// const {body }= require('express-validator');

const { valdationsSchems } = require('../middleWare/valdationsSchems');

const router = require('express').Router();
const coursesController = require('../controllers/courses.controller');
const { verifyToken } = require('../middleWare/verifyToken');
const { allowedTo } = require('../middleWare/allowedTo');
const userRoles = require('../utils/users_roles');
router.get('/',verifyToken, coursesController.getAllCourses)
  .get('/:id',verifyToken, coursesController.getCourse)
  .post('/', verifyToken,valdationsSchems.courseValidation, coursesController.addCourse)
  .patch('/:id',verifyToken, coursesController.updateCourse)
  .delete('/:id',verifyToken,allowedTo([userRoles.ADMIN,userRoles.MANAGER]), coursesController.deleteCourse);

module.exports = router;
