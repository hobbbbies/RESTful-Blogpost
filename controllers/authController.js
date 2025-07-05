const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ success: true, message: 'User registered successfully.', userId: user.id });
  } catch (error) {
    // Handle unique constraint violation (e.g., email already exists)
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: `User with this ${error.meta.target[0]} already exists.` });
    }
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

// @desc    Authenticate a user and get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Passwords match, create token
      const token =   jwt.sign(
        { id: user.id, username: user.username }, // Payload
        process.env.JWT_SECRET_KEY,                   // Secret
        { expiresIn: "1h" }                       // Expiration
      );
      
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        token: token,
      });
    } else {
      // User not found or password doesn't match
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};