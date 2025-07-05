const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById
};