const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        let token;
        let authHeader = req.headers.Authorization || req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            jwt.verify(token, "secret", (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json({ error: "Invalide token" });
                }
                req.user = user;

                next();
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error" });
    }
}

// tokenMiddleware

module.exports = verifyToken;