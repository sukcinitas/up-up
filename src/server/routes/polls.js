const router = require("express").Router();
let Poll = require("../models/poll.model");

router.route("/").get((req, res) => {
    Poll.find()
        .then(polls => res.json(polls))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/add").post((req, res) => {
    const {name, question, options, created_by} = req.body;
    const newPoll = new Poll({
        name,
        question,
        options,
        created_by,
        votes: 0
    })

    newPoll.save()
        .then(() => res.json("Successfully created a poll!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/:id").get((req, res) => {
    Poll.findById(req.params._id)
        .then(poll => res.json(poll))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/:id").delete((req, res) => {
    Poll.findByIdAndDelete(req.params._id)
        .then(() => res.json("Successfully deleted the poll!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;