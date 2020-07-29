require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")



//DB Connection
mongoose.connect('mongodb://localhost:27017/firstauth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => {
        console.log("DB CONNECTED");
    });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

//MY ROUTES
app.use("/api", authRoutes)
app.use("/api", userRoutes)


//PORT
PORT = process.env.PORT || 5000;

//STARTING A SERVER
app.listen(PORT, (req, res) => {
    console.log(`App is up and running at ${PORT}`)
});