import express from "express";

const router = express.Router();

/**
 * Base API Route - Welcome message
 */
router.get('/', (req, res) => {
    res.send('Welcome to the Chat Application API Route! Nothing to see here.');
});

/**
 * Include all other route modules
 */

export default router;