const { body } = require('express-validator');

const valdationsSchems = {
    courseValidation: [
        body('title').notEmpty().withMessage("title is required").isString().withMessage("shoud be string").trim().isLength({ min: 2, max: 100 }).withMessage("title should be between 2 and 100 characters"),
        body('price').notEmpty().withMessage("price is required").isFloat({ gt: 0 }).withMessage("price must be a positive number")
    ],

};



module.exports = { valdationsSchems };