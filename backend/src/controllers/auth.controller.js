import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => { 
    try {
        const { name, email, password, dob, gender, weight, height } = req.body;

        // Individual field validations
        if (!name || !email || !password || !dob || !gender || !weight || !height) {
            return res.status(400).json({ message: "Please fill in all fields" });
          }

        // Password length check
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Validate DOB, Weight, Height
        if (isNaN(new Date(dob))) {
            return res.status(400).json({ message: "DOB must be a valid date" });
          }
        if (isNaN(weight) || weight <= 0) {
            return res.status(400).json({ message: 'Weight must be a valid positive number' });
        }
        if (isNaN(height) || height <= 0) {
            return res.status(400).json({ message: 'Height must be a valid positive number' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dob: new Date(dob),
            gender,
            weight,
            height,
        });

        await newUser.save();
        generateToken(newUser._id, res);

        res.status(201).json({
            message: 'User registered successfully',
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            dob: newUser.dob,
            gender: newUser.gender,
            weight: newUser.weight,
            height: newUser.height,
        });
    } catch (error) {
        console.error('Error in signup controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token & send cookie
        generateToken(user._id, res);

        // Respond with user data
        res.status(200).json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            weight: user.weight,
            height: user.height,
        });
    } catch (error) {
        console.error('Error in login controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "None",
            expires: new Date(0),
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in getProfile controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
