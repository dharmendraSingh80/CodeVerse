const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendship_controller');
router.get('/friend-toggle', friendsController.friendship);


module.exports = router;