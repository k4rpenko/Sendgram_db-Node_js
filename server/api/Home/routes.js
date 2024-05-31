const express = require("express");
const pg = require("../cone");
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const connectM = require('../../libs/mongodb_M');
const Topic = require('../../models/t');


const router = express.Router();

router.use(express.json());
router.use(cookieParser())


router.get('/', async (req, res) => {
    let client;
    try {
        client = await pg.connect();
        const refreshToken = req.cookies['auth_token'];
        if (refreshToken) {
            const jwtres = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const id = jwtres.data[1];
            if (typeof jwtres === 'object' && jwtres !== null) {
                const result = await client.query('SELECT id, id_user, email, password, name, avatar, backgroundimg FROM public.users WHERE id = $1;', [id]);
                if (result.rows.length > 0) {
                    const NamePort = result.rows[0].name;
                    const id_user = result.rows[0].id_user;
                    const UserLogo = result.rows[0].avatar;
                    const backgroundimg = result.rows[0].backgroundimg;
                    const currentDate = new Date();
                    const oneMonthAgo = new Date(currentDate.getTime());
                    oneMonthAgo.setMonth(currentDate.getMonth() - 1);
                    const topics = await Topic.aggregate([
                        { $sample: { size: 10 } }
                    ]);
                    return res.status(201).json({ topics, NamePort, id_user, UserLogo, backgroundimg });
                }
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(400).json({ error: 'No cookie' });
        }
        return res.status(400).json({ error: 'No cookie' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});

module.exports = router;
