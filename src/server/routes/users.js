const router = require("express").Router();
let User = require("../models/user.model");

router.route("/sign-up").post((req, res) => {
    const newUser = new User({
        username: req.body.signup_username,
        email: req.body.signup_email,
        password: req.body.signup_password
    })

    newUser.save()
        .then(() => res.json({redirect: true}))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;