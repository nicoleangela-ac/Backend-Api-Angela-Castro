const express = require('express');
const router = express.Router();

const groceryController = require('../controllers/grocery-controller');
const isAuth = require('../middlewares/isAuth');

router.get('/getGrocery',  isAuth, groceryController.getGrocery);

router.put('/createGrocery', isAuth, groceryController.createGrocery);

router.patch('/editGrocery', isAuth, groceryController.editGrocery);

router.delete('/deleteGrocery', isAuth,  groceryController.deleteGrocery);

module.exports = router;