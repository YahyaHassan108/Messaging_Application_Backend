import { auth } from "../config/firebaseConfig.js"; // Import Firebase Admin SDK configuration

/**
 * Middleware to verify Firebase ID token for HTTP requests.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
// export const verifyToken = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
//
//     if (!token) {
//         return res.status(401).json({
//             error: true,
//             message: 'Authorization token is required'
//         });
//     }
//
//     try {
//         // Verify the token with Firebase Admin SDK
//         const decodedToken = await auth.verifyIdToken(token);
//
//         // Attach the decoded token (user info) to the request object
//         req.user = decodedToken;
//
//         // Proceed to the next middleware or route handler
//         next();
//     } catch (error) {
//         console.error('HTTP Token verification error:', error.message); // Log error details
//
//         // Send appropriate error response based on the error code
//         return res.status(401).json({
//             error: true,
//             message: error.code === 'auth/id-token-expired'
//                 ? 'Token has expired'
//                 : 'Invalid token'
//         });
//     }
// };

/**
 * Middleware to verify Firebase ID token for WebSocket connections.
 * @param {Socket} socket - Socket.IO socket object.
 * @param {Function} next - Next middleware function.
 */
export const verifySocketToken = async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        console.log("No token provided in handshake.");
        return next(new Error("Authentication token is required"));
    }

    // console.log(`Received token: ${token}`);

    try {
        const decodedToken = await auth.verifyIdToken(token);
        // console.log("Decoded token:", decodedToken);

        // Attach the decoded user to the socket object
        socket.user = decodedToken;

        // console.log("User attached to socket:", socket.user);
        next(); // Proceed with the connection
    } catch (error) {
        console.error("Token verification failed:", error.message);
        next(
            new Error(
                error.code === "auth/id-token-expired"
                    ? "Token has expired"
                    : "Invalid token"
            )
        );
    }
};
