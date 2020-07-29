const User = require("../models/user");

exports.getUserById = async (req, res, next, id) => {
    let user = await User.findById(id);
    try {
        if (!user) {
            return res.status(404).json({
                error: "No user was found in DB"
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encrypted_password = undefined;

    return res.json(req.profile);
};

exports.getAllUsers = async (req, res) => {
    let users = await User.find();
    try {
        if (users.length < 1) {
            return res.status(404).json({
                error: "No users was found in DB"
            });
        }
        return res.json(users);
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        let user = await User.findByIdAndUpdate(
            { _id: req.profile._id },
            { $set: req.body },
            { new: true, useFindAndModify: false }
        );

        user.salt = undefined;
        user.encrypted_password = undefined;
        return res.json(user);
    } catch (err) {
        return res.status(400).json({
            error: "You are not authorized to update this info"
        });
    }
};