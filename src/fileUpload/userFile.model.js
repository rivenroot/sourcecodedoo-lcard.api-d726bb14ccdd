const mongoose = require('mongoose');
const { Schema } = mongoose;

const userFileSchema = new Schema(
    {
        fileName: {type: String, required: true},
        filePath: { type: String, required: true},
        mimeType: {type: String, required: true}
    },
    {
        timestamps: {
          createdAt: 'createdAt',
          updatedAt: 'updatedAt',
        },
    }
);
const UserFile = mongoose.model('userFile', userFileSchema);
module.exports = UserFile;