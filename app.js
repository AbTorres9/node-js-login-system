require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')


const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user");
const router = require('./routes/auth');


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
app.use("/api", userRoutes) // Keep these separate. Dont combine 2 types into one name
// even if you have to combine, make a separate route file with sub branches

app.use('/docs', require('./routes/docs'));

//PORT
PORT = process.env.PORT || 5000;

//STARTING A SERVER
app.listen(PORT, (req, res) => {
    console.log(`App is up and running at ${PORT}`)
});