const { verifyJwt } = require("../utils/jwtFunctions");

// Middleware to protect routes that require authentication.
function authMiddleware(request, response, next) {
    try {
        const authHeader = request.headers.authorization;

        // Check if the Authorization header exists.
        if (!authHeader) {
            return response.status(401).json({
                message: "Authorization header is missing."
            });
        }

        // Check if the header starts with "Bearer ".
        if (!authHeader.startsWith("Bearer ")) {
            return response.status(401).json({
                message: "Invalid authorization format."
            });
        }

        // Extract the token from "Bearer <token>".
        const token = authHeader.split(" ")[1];

        // Verify the token.
        const decodedToken = verifyJwt(token);

        // Attach the decoded user information to the request object.
        request.user = decodedToken;

        // Continue to the next middleware or route handler.
        next();

    } catch (error) {
        console.error(error);

        return response.status(401).json({
            message: "Invalid or expired token."
        });
    }
}

module.exports = authMiddleware;