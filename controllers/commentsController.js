const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const getAllComments = async (req, res) => {
    try {
    const comments = await prisma.comment.findMany({
        select: {
            id: true,
            content: true,
            postId: true,
            author: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
}

const getCommentById = async (req, res) => {
    try {
    const comment = await prisma.comment.findUnique({
        where: {
            id: parseInt(req.params.commentid),
        },
        select: {
            id: true,
            content: true,
            postId: true,
            author: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
    });

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
}

const createComment = async (req, res) => {
    try {
    const { content } = req.body;
    const userid = parseInt(req.user.id);
    const postid = parseInt(req.params.postid);
    if (!comment || !userid) {
        return res
            .status(400)
            .json({ success: false, message: "Title and authorId are required." });
    }

    const comment = await prisma.comment.create({
        data: {
            content: content,
            postId: postid,
            authorId: userid,
        }
    })

    res.status(200).json({
      success: true,
      data: comment
    });
    } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
}

const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const commentid = parseInt(req.params.commentid);
    const userid = req.user.id;
    const comment = await prisma.comment.findUnique({
      where: { id: commentid },
    });

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    if (comment.authorId !== userid) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User not authorized to update this comment.",
        });
    }

    const update = await prisma.comment.update({
      where: {
        id: commentid
      },
      data: {
        content: content || undefined,
      }
    })
    res.status(200).json({
      success: true,
      data: update
    })
  } catch(error) {
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
}

const deleteComment = async (req, res) => {
    try {
    const { content } = req.body;
    const commentid = parseInt(req.params.commentid);
    const userid = req.user.id;
    const comment = await prisma.comment.findUnique({
      where: { id: commentid },
    });

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    if (comment.authorId !== userid) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User not authorized to delete this comment.",
        });
    }

    const deleteComment = await prisma.comment.delete({
      where: {
        id: commentid
      }
    })
    res.status(200).json({
      success: true,
      data: deleteComment
    })
  } catch(error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
}

module.exports = {
    getAllComments,
    createComment,
    updateComment,
    deleteComment,
    getCommentById
}