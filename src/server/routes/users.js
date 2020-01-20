const router = require("express").Router();
let User = require("../models/user.model");
let Poll = require("../models/poll.model");

router.route("/register").post((req, res) => {
    //will need validation
    User.find({username: req.body.signup_username})
        .then(user => user.length > 0 ? res.json({username_taken: true}) : res.json({username_taken: false}))
        .catch(err => console.error(err));

    User.find({email: req.body.signup_email})
        .then(email => email.length > 0 ? res.json({email_taken: true}) : res.json({email_taken: false}))
        .catch(err => console.error(err));

    const newUser = new User({
        username: req.body.signup_username,
        email: req.body.signup_email,
        password: req.body.signup_password
    })

    newUser.save()
        .then(() => res.json({redirect: true}))
        .catch(err => res.status(400).json({error: err}));
});

router.route("/create-poll").post((req, res) => {
    const {name, question, options, created_by} = req.body;
    const newPoll = new Poll({
        name,
        question,
        votes: 0,
        options,
        created_by
    })
    newPoll.save()
        .then(() => res.json({"redirect": true}))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/polls").get((req, res) => {
    Poll.find({username: req.body.username})
        .then((polls) => res.json({polls}))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/profile").get((req, res) => {
    User.find({username: req.body.username}, "-password")
        .then((user) => res.json({user}))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/profile").put((req, res) => {
    User.findByIdAndUpdate({_id: req.body._id}, req.body)
        .then(() => res.send("successfully updated"))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;