const express = require("express");
const router = express.Router();
const controller = require('../controllers/postsController')

router.get('/posts', controller.getAllPosts);

router.get('/posts/:postid', controller.getPostById);

module.exports = router;