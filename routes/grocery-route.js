const express = require('express');
const router = express.Router();

const groceryController = require('../controllers/grocery-controller');
const isAuth = require('../middlewares/isAuth');

router.get('/',  isAuth, groceryController.getGrocery);

router.put('/', isAuth, groceryController.createGrocery);

router.patch('/', isAuth, groceryController.editGrocery);

router.delete('/', isAuth,  groceryController.deleteGrocery);

module.exports = router;