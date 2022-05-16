const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    createWorkout: [
        {
            type: Schema.Types.ObjectId,
            //ref to events.js mongoose.model('Event', eventSchema);
            ref: 'Workout'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);