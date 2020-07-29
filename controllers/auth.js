const User = require("../models/user")
const { validationResult, check } = require("express-validator")

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = async (req, res) => {
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            })
        }

        const user = await new User(req.body).save();

        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    } catch (err) {
        res.status(500).json({
            error: "Not able to save user in DB"
        })
    }
}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;


        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                error: "User emaildoes not exist in db"
            })
        }

        if (!user.autheticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }

        //create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET)
        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 10 });

        //send response to front end
        const { name, email: usermail, _id } = user;
        return res.json({ token, user: { name, email, _id } })
    } catch (err) {
        res.status(500).json({
            error: "Login failed"
        })
    }
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User Signout Successfully"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
})

//custom mddleware
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};