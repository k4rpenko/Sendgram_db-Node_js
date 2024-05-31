const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')

router.use(express.json());
router.use(cookieParser())

router.get('/', async (req, res) => {
    try {
        const refreshToken = req.cookies['auth_token'];
        if (refreshToken) {
            const jwtres = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const id = jwtres.data[1];
            if (typeof jwtres === 'object' && jwtres !== null) {
                return res.status(200).json({ id });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error ' + error.message });
    }
});


module.exports = router;