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
    date: "Mon Jan 01 1990",
    user_id: {type: String, required: true}
})

const Excercise = mongoose.model('Excercise', excercisSchema);