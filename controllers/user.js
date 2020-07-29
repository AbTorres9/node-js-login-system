const User = require("../models/user")

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = user
        next()
    })
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encrypted_password = undefined;

    return res.json(req.profile)
}

exports.getAllUsers = (req, res) => {
    User.find().exec((error, users) => {
        if (error || !users) {
            return res.status(400).json({
                error: "No users was found in DB"
            })

        }

        return res.json(users)
    })
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(

        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (error, user) => {
            if (error) {
                return res.status(400).json({
                    error: "You are not authorized to update this info"
                })
            }
            user.salt = undefined;
            user.encrypted_password = undefined;
            res.json(user)
        }
    )
}