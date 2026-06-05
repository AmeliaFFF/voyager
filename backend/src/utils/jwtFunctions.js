const jwt = require("jsonwebtoken");

// Generate a JWT for a successfully authenticated user.
function generateJwt(targetUser) {
    const newJwt = jwt.sign(
        {
            userId: targetUser.id,
            isAdmin: targetUser.isAdmin
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "7d"
        }
    );

    return newJwt;
}

// Verify and decode a JWT.
function verifyJwt(targetJwt) {
    const decodedToken = jwt.verify(targetJwt, process.env.JWT_SECRET_KEY);
    return decodedToken;
}

module.exports = {
    generateJwt,
    verifyJwt
};