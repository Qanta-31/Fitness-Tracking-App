import jwt, { decode } from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({message: "Unauthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded) {
            return res.status(401).json({message : "Unauthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password"); 

        if(!user) {
            return res.status(404).json({message : "User not found"})
        }

        // If the user is found in the database, the user's data (excluding the password) is assigned to req.user.
        // This means that the req.user property now contains the information about the authenticated user, which can be accessed in any subsequent middleware or route handler.
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}