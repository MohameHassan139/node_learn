
const { valdationsSchems } = require('../middleWare/valdationsSchems');
const { verifyToken } = require('../middleWare/verifyToken');
const router = require('express').Router();
const userController = require('../controllers/user.controller');
const multer = require('multer');
const appError = require('../utils/appError');
const statusText = require('../utils/httpStatusText');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }

});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      return  cb(null, true);
    } else {
     return   cb(appError.createError(400,"Only image files are allowed!",statusText.ERROR ), false);
    }
};

const upload = multer({ storage: diskStorage, fileFilter: fileFilter });

router.post('/register', upload.single('avatar'), userController.register);
router.post('/login', userController.login);
router.get('/', verifyToken, userController.getAllUsers);

module.exports = router;
