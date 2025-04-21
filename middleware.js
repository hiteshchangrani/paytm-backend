const jwt = require("jsonwebtoken");
const JWT_SECRET = require("./config");
const logger = require("./logger"); // Import logger

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("Unauthorized access attempt", { ip: req.ip, route: req.originalUrl });
        return res.status(403).json({ error: "Not Authorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        logger.info("Token verified successfully", { userId: decoded.userId, route: req.originalUrl });

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
    } catch (err) {
        logger.error("Token verification failed", { error: err.message, route: req.originalUrl, ip: req.ip });
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = { authMiddleware };
