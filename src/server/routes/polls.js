const mongoose = require("mongoose");
const router = require("express").Router();
let Poll = require("../models/poll.model");

router.route("/").get( async (req, res) => {
    try {
        const polls = await Poll.find({}, "name votes createdAt created_by updatedAt")
                                .sort("-updatedAt");
        res.json(polls);
    } catch (err) {
        res.json(`Error: ${err}`)
    }

});

router.route("/:id").get( async (req, res) => {
    try {
        console.log(req.session)
        const poll = await Poll.findById(req.params.id);
        res.json(poll);
    } catch (err) {
        res.json(`Error: ${err}`)
    }
});

//only user
router.route("/:id").delete( async (req, res) => {
    try {
        await Poll.findByIdAndDelete(req.params.id);
        res.json({"redirect": true});
    } catch (err) {
        res.json(`Error: ${err}`)
    }
})

//vote
router.route("/:id").put( async (req, res) => {
    try {
        const {option, options, votes} = req.body;
        const updatedOptions = Object.assign({}, options);
        updatedOptions[option] = options[option] + 1;

        await Poll.findByIdAndUpdate(req.params.id, {votes: votes + 1, options: updatedOptions, updatedAt: Date.now()});
        res.json({"redirect": true});
    } catch (err) {
        res.json(`Error: ${err}`)
    }
});

module.exports = router;