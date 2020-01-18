const mongoose = require("mongoose");
const router = require("express").Router();
let Poll = require("../models/poll.model");

router.route("/").get((req, res) => {
    Poll.find({}, "name votes createdAt created_by updatedAt")
        .sort("-updatedAt")
        .then(polls => res.json(polls))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/:id").get((req, res) => {
    Poll.findById(req.params.id)
        .then(poll => res.json(poll))
        .catch(err => res.status(400).json(`Error: ${err}`));
});
//only user
router.route("/:id").delete((req, res) => {
    Poll.findByIdAndDelete(req.params.id)
        .then(res.json({"redirect": true}))
        .catch(err => res.status(400).json(`Error: ${err}`));
});
//vote
router.route("/:id").put((req, res) => {
    const {option, options, votes} = req.body;
    const updatedOptions = Object.assign({}, options);
    updatedOptions[option] = options[option] + 1;

    Poll.findByIdAndUpdate(req.params.id, {votes: votes + 1, options: updatedOptions, updatedAt: Date.now()})
        .then(res.json({"redirect": true}))
        .catch(err => res.status(400).json(`Error: ${err}`));   
});

module.exports = router;