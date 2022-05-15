const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');
const isAuth = require('../middlewares/isAuth');

//login the user
router.post('/login',  authController.login);

router.post('/token', authController.token);

//register the user
router.put('/register',  authController.registerUser);

//update the user info (name, password and permissionLevel)
router.patch('/updateUser', isAuth, authController.updateUser);

//logout the user
router.delete('/logout', isAuth, authController.logout);

//delete the user
router.delete('/deleteUser', isAuth,  authController.deleteUser);

module.exports = router;