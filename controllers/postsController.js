const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const userid = req.user?.id;
    const postid = parseInt(req.params.postid);
    const post = await prisma.post.findUnique({
      where: {
        id: postid,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!post.published) {
      // Allow access ONLY if the logged-in user is the author
      if (userid && post.authorId === userid) {
        return res.status(200).json({ success: true, data: post });
      } else {
        // For everyone else, pretend it doesn't exist
        return res.status(404).json({ success: false, message: "Post not found" });
      }
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, published } = req.body;

    if (!title || !req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "Title and authorId are required." });
    }

    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: parseInt(req.user.id),
        published: published || undefined,
      },
    });

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const postid = parseInt(req.params.postid);
    const userid = req.user.id;
    const post = await prisma.post.findUnique({
      where: { id: postid },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found." });
    }

    if (post.authorId !== userid) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User not authorized to update this post.",
        });
    }

    const update = await prisma.post.update({
      where: {
        id: parseInt(postid),
      },
      data: {
        title: title || undefined,
        content: content || undefined,
      },
    });
    res.status(200).json({
      success: true,
      data: update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postid = parseInt(req.params.postid);
    const userid = req.user.id;
    const post = await prisma.post.findUnique({
      where: { id: postid },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found." });
    }

    if (post.authorId !== userid) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User not authorized to delete this post.",
        });
    }

    const deletePost = await prisma.post.delete({
      where: {
        id: postid,
      },
    });
    res.status(200).json({
      success: true,
      data: deletePost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
