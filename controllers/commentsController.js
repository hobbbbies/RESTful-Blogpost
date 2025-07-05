const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const getAllComments = async (req, res) => {
    try {
    const comments = await prisma.comment.findMany({
        // author: {
        //   select: {
        //     id: true,
        //     username: true,
        //     email: true
        //   }
        // },
        select: {
            id: true,
            content: true,
            postId: true
            // author: {
            //   select: {
            //     id: true,
            //     username: true,
            //     email: true,
            //   },
            // },
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
        // author: {
        //   select: {
        //     id: true,
        //     username: true,
        //     email: true
        //   }
        // },
        select: {
            id: true,
            content: true,
            postId: true
            // author: {
            //   select: {
            //     id: true,
            //     username: true,
            //     email: true,
            //   },
            // },
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
    const comment = await prisma.comment.create({
        data: {
            content: req.body.content,
            postId: parseInt(req.params.postid)
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
    const update = await prisma.comment.update({
      where: {
        id: parseInt(req.params.commentid)
      },
      data: {
        content: req.body.content || undefined,
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
    const deleteComment = await prisma.comment.delete({
      where: {
        id: parseInt(req.params.commentid)
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