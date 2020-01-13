const mongoose = require("mongoose");
const router = require("express").Router();
let Poll = require("../models/poll.model");

router.route("/").get((req, res) => {
    Poll.find({}, "name votes createdAt created_by")
        .then(polls => res.json(polls))
        .catch(err => res.status(400).json(`Error: ${err}`));
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

router.route("/poll/:id").get((req, res) => {
    Poll.findById(req.params.id)
        .then(poll => res.json(poll))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/poll/:id").delete((req, res) => {
    Poll.findByIdAndDelete(req.params.id)
        .then(res.json({"redirect": true}))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/poll/:id").put((req, res) => {
    const {option, options, votes} = req.body;
    const updatedOptions = options;
    updatedOptions[option] = options[option] + 1;
    console.log(updatedOptions);
    Poll.findByIdAndUpdate(req.params.id, {votes: votes + 1, options: updatedOptions})
        .then(res.json({"redirect": true}))
        .catch(err => res.status(400).json(`Error: ${err}`));   
});

module.exports = router;