const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [String],
    votes: Number,
    created_by: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
