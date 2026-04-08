// Logs basic information about each incoming request. This is useful for debugging and monitoring purposes.
function requestLogger(request, response, next) {
    const start = Date.now();

    response.on("finish", () => {
        const duration = Date.now() - start;

        console.log(`${request.method} ${request.originalUrl} - ${response.statusCode} - ${duration}ms`);
    });

    next();
}

module.exports = requestLogger;