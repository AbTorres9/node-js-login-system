var express = require("express");
var app = express();

var router = express.Router();

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const { validationResult, check } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { contextsKey } = require("express-validator/src/base");



//Routes
/**
 * @swagger
 * /api/signup
 * post:
 *  description: Allows new user to safely signup into the db
 *  responses:
 *      '200':
 *          description: Asuccessful response
 */
router.post(
    "/signup",
    [
        check("name")
            .isLength({ min: 3 })
            .withMessage("must be at least 3 chars long"),
        check("email").isEmail().withMessage("email is required"),
        check("password")
            .isLength({ min: 5 })
            .withMessage("password should be atleast 5 chars long"),
    ],
    signup
);

router.post(
    "/signin",
    [
        check("email").isEmail().withMessage("email is required"),
        check("password").isLength({ min: 5 }).withMessage("password is required"),
    ],
    signin
);

router.get("/signout", signout);

//CREATED A TEST ROUTE JUST TGO SHOW WE CAN PROTECT ANY ROUTE AND CAN CHECK FOR TOKEN
router.get("/testroute", isSignedIn, (req, res) => {
    res.send("A protected route");
});

module.exports = router;
