const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * local storage - This file will be used to create the local storage for the application
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/resource'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext)
    }
});

module.exports = {
    storage
}