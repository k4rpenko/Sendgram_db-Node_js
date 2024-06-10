const express = require("express");
require('dotenv').config();
const Home = require('./api/Home/routes');
var cors = require('cors')
const Regists = require('./api/auth/SignUp/routes');
const LookFollow = require('./api/Profile/LookFollow/routes');
const Profile = require('./api/Profile/routes')
const Follow = require('./api/Profile/Follow/routes');
const UnFollow = require('./api/Profile/UnFollow/routes');
const Login = require('./api/auth/Login/routes');
const Settings = require('./api/Settings/ChangeProfile/routes');

const PORT = 3001;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));



app.use(express.json());
app.use("/api/Home", Home);
app.use("/api/Profile", Profile);
app.use("/api/auth/Regists", Regists);
app.use("/api/LookFollow", LookFollow);
app.use("/api/Follow", Follow);
app.use("/api/UnFollow", UnFollow);
app.use("/api/auth/Login", Login);
app.use("/api/Settings", Settings);
/*



*/

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
