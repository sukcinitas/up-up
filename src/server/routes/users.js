const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/signup").post((req, res) => {
    const newUser = new User({
        username: req.body.signup_username,
        email: req.body.signup_email,
        password: req.body.signup_password
    })

    newUser.save()
        .then(() => res.json("Successfully signed up!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

// router.route("/update/:id").post((req, res) => {
//     const newUser = new User({
//         username: req.body.signup_username,
//         email: req.body.signup_email,
//         password: req.body.signup_password
//     })

//     newUser.save()
//         .then(() => res.json("Successfully signed up!"))
//         .catch(err => res.status(400).json(`Error: ${err}`));
// });

module.exports = router;