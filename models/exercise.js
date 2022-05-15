const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    uuid: { type: String },
    title: {
        type: String,
        required: true
    },
    sets: [{ type: Number }],
    weight: { type: Number },
    timed: { type: Boolean },
    timer: { type: Number },
    metric: { type: Boolean },
    notes: { type: String },
    reps: [{ type: Number }],
    uri: { type: String },
    imgUrl: { type: String },
    workout: {
        type: Schema.Types.ObjectId,
        ref: 'Workout',
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);