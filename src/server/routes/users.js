const router = require("express").Router();
let User = require("../models/user.model");
let Poll = require("../models/poll.model");

router.route("/register").post( async (req, res) => {

    process.on('unhandledRejection', function(err) {
        console.log(err);
    });

    try {
        // will need validation
        const user = await User.find({username: req.body.username});
        const email = await User.find({email: req.body.email});

        user.length > 0 && email.length > 0 ? res.json({username_taken: true,
                                                        email_taken: true}) : "";
        user.length > 0 ? res.json({username_taken: true}) : "";
        email.length > 0 ? res.json({email_taken: true}) : "";

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        await newUser.save();
        res.json({redirect: true});

    } catch (err) {
        res.json(`Error: ${err}`);
    }
});

router.route("/login").post( async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        password === user.password ? res.json({isAuthenticated: true}) : res.json({error: "password incorrect"});
    } catch (err) {
        console.log(err);
        res.json(`Error: ${err}`);
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
        res.json(`Error: ${err}`);
    }
});

router.route("/polls").get( async (req, res) => {
    try {
        const polls = await Poll.find({username: req.body.username});
        res.json({polls});
    } catch (err) {
        res.json(`Error: ${err}`);
    }
});

router.route("/profile").get( async (req, res) => {
    try {
        const user = await User.find({username: req.body.username}, "-password");
        res.json({user});
    } catch (err) {
        res.json(`Error: ${err}`);
    }
});

router.route("/profile").put( async (req, res) => {
    try {
        await User.findByIdAndUpdate({_id: req.body._id}, req.body);
        res.send("successfully updated");
    } catch (err) {
        res.json(`Error: ${err}`);
    }
});

module.exports = router;