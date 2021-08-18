const UserFile = require('./userFile.model');
const upload = require("../../middlewares/fileUpload");


exports.uploadFile = async (req, res) => {
    try {
        await upload(req, res);
        
        if (req.file == undefined) {
            return res.status(400).send({ message: "Choose a file to upload" });
        }
        let userFile = new UserFile();
        userFile = {
            ...userFile,
            fileName: req.file.filename,
            filePath: req.file.path,
            mimeType: req.file.mimetype
        }
        await UserFile.create(userFile, function(err, doc) {
            if(doc) {
                return res.status(200).json({
                    success: true,
                    message: 'File uploaded successfully.',
                    data : doc
                });
            }
        })
    } catch (err) {
        console.log(err);
        
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).json({
                error: true, 
                status: 500,
                message: "File size should be less than 100MB",
            });
        }
        
        res.status(500).json({
            error: true,
            status: 500,
            message: `Error occured: ${err}`,
        });
    }
};