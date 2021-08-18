const util = require("util");
const multer = require("multer");

const DIR = './uploads/';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    },
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "video/mp4" || file.mimetype == "video/ogg" || file.mimetype == "video/webm") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File types allowed .jpeg, .jpg, .png, .mp4, .ogg and .webm!'));
        }
    }
}).single('file');

let fileUploadMiddleware = util.promisify(upload);

module.exports = fileUploadMiddleware;