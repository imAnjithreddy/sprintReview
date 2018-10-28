const express = require("express");
const app = express();
var cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//DB from config
const db = require("./config/keys").mongoURI;
//Connection to mongoose
mongoose
.connect(db)
.then(()=>{console.log("MongoDB connected")})
.catch(err => console.log(err));


const port = 8081;
//Passport middleware
app.use(passport.initialize());

//Passport Config

require("./config/passport")(passport);

app.use("/api/users",users);
app.use("/api/profile",profile);
app.use("/api/posts",posts);

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})