const express = require('express');
const cleanBody = require('../middlewares/cleanbody');
const { validateToken } = require('../middlewares/validateToken');
const AuthController = require('../src/users/user.controller');

const router = express.Router();

// Define endpoints
router.post('/signup', cleanBody, AuthController.Signup);
router.patch('/activate', cleanBody, AuthController.Activate);
router.post('/login', cleanBody, AuthController.Login);
router.get('/logout', validateToken, AuthController.Logout);
router.patch('/forgot', cleanBody, AuthController.Forgot);
router.patch('/reset', cleanBody, AuthController.Reset);
router.delete('', AuthController.DeleteAllUsers);

module.exports = router;
