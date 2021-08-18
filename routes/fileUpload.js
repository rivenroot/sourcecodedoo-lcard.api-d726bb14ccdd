const express = require('express');
const cleanBody = require('../middlewares/cleanbody');
const { validateToken } = require('../middlewares/validateToken');
const UserFile = require('../src/fileUpload/fileUpload.controller');

const router = express.Router();
router.post('/upload', validateToken, UserFile.uploadFile);
module.exports = router;