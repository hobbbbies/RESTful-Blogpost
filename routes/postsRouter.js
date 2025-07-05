const express = require("express");
const router = express.Router();
const controller = require('../controllers/postsController')
const commentController = require('../controllers/commentsController');
const getToken = require('../middleware/getToken');
const verifyToken = require('../middleware/verifyToken');

router.get('/posts', controller.getAllPosts);

router.get('/posts/:postid', controller.getPostById);

router.post('/posts', getToken, verifyToken, controller.createPost);

router.put('/posts/:postid', controller.updatePost);

router.delete('/posts/:postid', controller.deletePost);

router.get('/posts/:postid/comments', commentController.getAllComments);

router.get('/posts/:postid/comments/:commentid', commentController.getCommentById)

router.post('/posts/:postid/comments', commentController.createComment)

router.put('/posts/:postid/comments/:commentid', commentController.updateComment);

router.delete('/posts/:postid/comments/:commentid', commentController.deleteComment);

module.exports = router;