// Middleware to protect routes that require admin access.
// This is used after authMiddleware, because it relies on request.user being available.
function adminMiddleware(request, response, next) {
    if (!request.user || request.user.isAdmin !== true) {
        return response.status(403).json({
            message: "Admin access required."
        });
    }

    next();
}

module.exports = adminMiddleware;