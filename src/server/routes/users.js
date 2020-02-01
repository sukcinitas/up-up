const router = require("express").Router();
let User = require("../models/user.model");
let Poll = require("../models/poll.model");
import { compareSync } from "bcryptjs";

const sessionizeUser = user => {
    return {userId: user._id, username: user.username};
};

router.route("/register").post( async (req, res) => {

    // process.on('unhandledRejection', function(err) {
    //     console.log(err);
    // });

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
        let sessionUser = sessionizeUser(newUser);
        req.session.user = sessionUser;
        res.json({redirect: true, sessionUser});

    } catch (err) {
        console.log("register", err);
        res.json(`Error: ${err}`);
    }
});

router.route("/login").post( async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && compareSync(password, user.password)) {
            const sessionUser = sessionizeUser(user);
            req.session.user = sessionUser;
            res.json({isAuthenticated: true, sessionUser});
        } else {
            res.status(404).res.json({error: "password incorrect"});
        };
    } catch (err) {
        console.log("login0",err);
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
        res.json({"redirect": true, id: newPoll.id});
    } catch (err) {
        console.log("create err", err)
        res.json(`Error: ${err}`);
    }
});

router.route("/polls/:username").get( async (req, res) => {
    try {
        const polls = await Poll.find({created_by: req.params.username});
        res.json({ polls });
    } catch (err) {
        res.json(`Error: ${err}`);
    }
});

router.route("/profile/:username").get( async (req, res) => {
    try {
        const user = await User.find({username: req.params.username}, "-password");
        res.json({user});
    } catch (err) {
        res.json(`Error: ${err}`);
    }
});

router.route("/profile").put( async (req, res) => {
    try {
        const { parameter } = req.body;
        if (parameter === "email") {
            const email = await User.find({email: req.body.email});
            email.length > 0 ? res.json({message: "email is already in use!"}) : "";
            await User.findByIdAndUpdate({_id: req.body._id}, {email: req.body.email});
        } else if (parameter === "password") {
            const user = await User.findOne({username: req.body.username});
            if (user && compareSync(req.body.oldpassword, user.password)) {
                // const updatedUser = await User.findByIdAndUpdate({_id: req.body._id}, {password: req.body.newpassword}, {new: true});
                // updatedUser.save(); //should hash password
                user.password = req.body.newpassword;
                await user.save();
            } else {
                res.json({message: "password incorrect"});
            };
        }

        res.json({message: `Your ${parameter} has been successfully updated!`});
    } catch (err) {
        res.json(`Error: ${err}`);
    }
});

router.route("/logout").delete( async (req, res) => {
    try {
        const { user } = req.session;
        if (user) {
            req.session.destroy(err => {
                if (err) throw err;
                res.clearCookie(process.env.SESS_NAME);
                res.json({session_deleted: true});
            });
        }
    } catch (err) {
        res.json(`Error: ${err}`);
    }
});

router.route("/login").get( (req, res) => {
    try {
    console.log("session user", req.session);
    res.json({user: req.session.user});
    } catch (err) {
        res.json(`Error: ${err}`);
    }
    
});

module.exports = router;