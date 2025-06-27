import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Add this check
    if (!user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Generate JWT token (optional but recommended)
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false,
      department: user.department,
      rollNumber: user.rollNumber,
      mobile: user.mobile
    };
    
    res.status(200).json({
      message: "Login successful",
      user: userData,
      token // Include the token in response
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  console.log("Registration request received:", req.body);
  const { name, email, password,  department, rollNumber, mobile } = req.body;
  try {
    if ([name, email, password, department, rollNumber, mobile].some(field => !field)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.find({ email });
    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      username: name,
      email,
      password: password,
      department,
      rollNumber,
      mobile
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        department: newUser.department,
        rollNumber: newUser.rollNumber,
        mobile: newUser.mobile
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
