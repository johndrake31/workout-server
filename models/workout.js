const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    uuid: { type: String },
    mainTitle: { type: String },
    discriptionShort: { type: String },
    discriptionExtra: { type: String },
    weekDuration: [{ type: Number }],
    restBreakSecs: { type: Number },
    daysPerWeek: [{ type: Number }],
    imgUrl: { type: String },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('Workout', workoutSchema);