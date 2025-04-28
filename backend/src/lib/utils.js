import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        httpOnly: true,  // Makes the cookie accessible only by the server
        sameSite: "strict",  // Prevents CSRF attacks
        secure: process.env.NODE_ENV !== "development",  // In development, cookies are not sent over https
    });

    return token;
};
