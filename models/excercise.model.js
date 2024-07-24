const mongoose = require('mongoose');

const excercisSchema = new mongoose.Schema({
    username: String,
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: Date,
    userId: {type: String, required: true}
})

const Excercise = mongoose.model('Excercise', excercisSchema);
module.exports = Excercise;