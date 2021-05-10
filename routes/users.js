const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');


router.get("/login",userController.getUserLogin);

router.get('/register', userController.getUserRegister);

router.post("/login",userController.postUserLogin);

router.post('/register', userController.postUserRegister);

module.exports = router;