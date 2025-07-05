const express = require("express");
const router = express.Router();
const controller = require('../controllers/postsController')
const commentController = require('../controllers/commentsController');
const getToken = require('../middleware/getToken');
const verifyToken = require('../middleware/verifyToken');

router.get('/posts', controller.getAllPosts);

router.get('/posts/:postid', controller.getPostById);

router.post('/posts', getToken, verifyToken, controller.createPost);

router.put('/posts/:postid', getToken, verifyToken, controller.updatePost);

router.delete('/posts/:postid', getToken, verifyToken, controller.deletePost);

router.get('/posts/:postid/comments', commentController.getAllComments);

router.get('/posts/:postid/comments/:commentid', commentController.getCommentById)

router.post('/posts/:postid/comments', getToken, verifyToken, commentController.createComment)

router.put('/posts/:postid/comments/:commentid', getToken, verifyToken, commentController.updateComment);

router.delete('/posts/:postid/comments/:commentid', getToken, verifyToken, commentController.deleteComment);

module.exports = router;