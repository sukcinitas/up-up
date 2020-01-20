const router = require("express").Router();
let User = require("../models/user.model");
let Poll = require("../models/poll.model");

router.route("/register").post( async (req, res) => {
    try {
        //will need validation
        const user = await User.find({username: req.body.signup_username});
        user.length > 0 ? res.json({username_taken: true}) : res.json({username_taken: false});

        const email = await User.find({email: req.body.signup_email});
        email.length > 0 ? res.json({email_taken: true}) : res.json({email_taken: false});

        const newUser = new User({
            username: req.body.signup_username,
            email: req.body.signup_email,
            password: req.body.signup_password
        });

        await newUser.save();
        res.json({redirect: true});

    } catch (err) {
        res.status(400).json(`Error: ${err}`);
    }
});

router.route("/create-poll").post( async (req, res) => {
    try {
        const {name, question, options, created_by} = req.body;
        const newPoll = new Poll({
            name,
            question,
            votes: 0,
            options,
            created_by
        });
        await newPoll.save();
        res.json({"redirect": true});
    } catch (err) {
        res.status(400).json(`Error: ${err}`);
    }
});

router.route("/polls").get( async (req, res) => {
    try {
        const polls = await Poll.find({username: req.body.username});
       res.json({polls});
    } catch (err) {
        res.status(400).json(`Error: ${err}`);
    }
});

router.route("/profile").get( async (req, res) => {
    try {
        const user = await User.find({username: req.body.username}, "-password");
        res.json({user});
    } catch (err) {
        res.status(400).json(`Error: ${err}`);
    }
});

router.route("/profile").put( async (req, res) => {
    try {
        await User.findByIdAndUpdate({_id: req.body._id}, req.body);
        res.send("successfully updated");
    } catch (err) {
        res.status(400).json(`Error: ${err}`);
    }
});

module.exports = router;